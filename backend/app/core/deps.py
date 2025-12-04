from fastapi import Request
from jose import jwt, JWTError
from app.core.config import setting
from app.utils.api_error import ApiError
from app.models.user import User

async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    
    if not token:
        auth_header = request.headers.get("Authorization")
        if auth_header:
            token = auth_header
        else:
            raise ApiError(401, "Not authenticated")

    token = token.replace("Bearer ", "")

    try:
        payload = jwt.decode(
            token,
            setting.JWT_SECRET,
            algorithms=[setting.JWT_ALGORITHM]
        )
        
        user_id = payload.get("sub")
        token_type = payload.get("type")

        if token_type != "full_access":
            raise ApiError(403, "MFA Verification Required or Invalid Token Scope")

        if not user_id:
            raise ApiError(401, "Invalid Token")

        user = await User.get(user_id)
        if not user:
            raise ApiError(404, "User not found")

        return user

    except JWTError:
        raise ApiError(401, "Invalid Token")