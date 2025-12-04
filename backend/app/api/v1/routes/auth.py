import pyotp
from datetime import timedelta
from jose import jwt, JWTError
from fastapi import APIRouter, Depends, Response, Body, Request
from fastapi.responses import JSONResponse
from app.models.user import User, UserCreate, UserLogin
from app.core.security import hash_password, compare_password, create_access_token
from app.utils.api_error import ApiError
from app.utils.api_response import ApiResponse
from app.core.deps import get_current_user
from app.utils.helper_func import generate_mfa_secret, generate_qr_code
from app.core.config import setting

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post('/signup')
async def sign_up(user: UserCreate):
    is_exist = await User.find_one(User.email == user.email)
    if is_exist:
        print("User exists")
        return ApiError(400, "User already exists with this email")
    
    hashed_password = hash_password(user.password)
    new_user = User(
        name=user.name, 
        email=user.email, 
        password=hashed_password, 
        phone=user.phone,
        mfa_enabled=False,
        mfa_secret=""
    )
    await new_user.create()

    user_dict = new_user.model_dump(exclude={"password", "id", "mfa_enabled", "mfa_secret"})

    return ApiResponse(201, user_dict, "User signed up successfully")

@router.post('/login')
async def login(user_data: UserLogin, response: Response):
    user = await User.find_one(User.email == user_data.email)
    if not user:
        return ApiError(404, "User not found with this email")
    
    if not compare_password(user_data.password, user.password):
        return ApiError(400, "Incorrect Password")
    
    if user.mfa_enabled:
        temp_token = create_access_token(
            {"sub": str(user.id), "type": "mfa_pending"}, 
            expires_delta=timedelta(minutes=5)
        )
        response.set_cookie(
            key="mfa_token",
            value=f"Bearer {temp_token}",
            httponly=True,
            secure=False,
            samesite="lax"
        )
        return ApiResponse(200, {
            "step": "mfa_required",
            "user_id": str(user.id),
        }, "Enter your authenticator app code")

    token = create_access_token({"sub": str(user.id), "type": "full_access"})

    response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,
        secure=False,
        samesite="lax"
    )

    return ApiResponse(200, {
        "access_token": token,
        "token_type": "bearer"
    }, message="Logged in successfully")

@router.get("/mfa/setup")
async def mfa_setup(current_user=Depends(get_current_user)):
    if current_user.mfa_enabled:
        return ApiError(400, "MFA already enabled")

    if not current_user.mfa_secret:
        secret = generate_mfa_secret()
        current_user.mfa_secret = secret
        await current_user.save()   # <-- THIS is where error occurred

    uri = pyotp.totp.TOTP(current_user.mfa_secret).provisioning_uri(
        name=current_user.name,
        issuer_name="TestApp.ai"
    )
    qr = generate_qr_code(uri)

    return ApiResponse(200, {"qr": qr, "secret": current_user.mfa_secret})

@router.post("/mfa/enable")
async def mfa_enable(code: str = Body(..., embed=True), current_user = Depends(get_current_user)):
    totp = pyotp.TOTP(current_user.mfa_secret)

    if not totp.verify(code):
        return ApiError(400, "Invalid code. Try again.")

    current_user.mfa_enabled = True
    await current_user.save()

    return ApiResponse(200, None, "MFA enabled successfully")

@router.post("/mfa/verify-login")
async def mfa_verify_login(code: str = Body(..., embed=True), request: Request = None):
    # 1. Get the Temp Token from Cookie
    temp_token_str = request.cookies.get("mfa_token")
    if not temp_token_str:
        raise ApiError(401, "Session expired, please login again")
    
    # --- Token Validation and Decoding ---
    try:
        token_pure = temp_token_str.replace("Bearer ", "")
        payload = jwt.decode(token_pure, setting.JWT_SECRET, algorithms=[setting.JWT_ALGORITHM])
        
        if payload.get("type") != "mfa_pending":
            raise ApiError(403, "Invalid token type")
            
        user_id = payload.get("sub")
    except JWTError:
        raise ApiError(401, "Invalid token")

    # --- User and OTP Verification ---
    user = await User.get(user_id)
    if not user:
        return ApiError(404, "User not found")

    totp = pyotp.TOTP(user.mfa_secret)
    if not totp.verify(code):
        return ApiError(400, "Invalid authentication code")

    # --- SUCCESS: Issue Full Access Token ---
    token = create_access_token({"sub": str(user.id), "type": "full_access"})
    
    # 1. Prepare the JSON content (similar to what ApiResponse would return)
    content = {
        "status": 200,
        "data": {"message": "MFA verified, you are logged in"},
        "message": "MFA verified, you are logged in"
    }

    # 2. Create the ACTUAL response object that will be returned
    final_response = JSONResponse(content=content, status_code=200)

    # 3. Set the REAL cookie on the final response object
    final_response.set_cookie(
        key="access_token",
        value=f"Bearer {token}",
        httponly=True,
        secure=False,      # Keep False for localhost
        samesite="lax",    # FIX: Corrected samesite setting
        max_age=1800       # Set an expiration for security (30 minutes)
    )
    
    # 4. Delete the temporary cookie
    final_response.delete_cookie("mfa_token")

    # 5. Return the response
    return final_response

@router.get("/profile")
async def profile(current_user = Depends(get_current_user)):
    return ApiResponse(200, current_user, "Current user fetched")