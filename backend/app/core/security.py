from passlib.context import CryptContext
from app.core.config import setting
from jose import jwt
import datetime

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto", argon2__hash_len=32, argon2__salt_len=16, argon2__time_cost=3, argon2__memory_cost=64 * 1024, argon2__parallelism=2)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def compare_password(plain: str, hashed: str) -> str:
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: datetime.timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.now(datetime.timezone.utc) + expires_delta
    else:
        expire = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=int(setting.JWT_TOKEN_EXPIRY))
    
    to_encode.update({'exp': expire})
    return jwt.encode(to_encode, key=setting.JWT_SECRET, algorithm=setting.JWT_ALGORITHM)