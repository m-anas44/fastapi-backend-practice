from beanie import Document
from pydantic import BaseModel\

class User(Document):
    name: str
    email: str
    password: str
    phone: str
    mfa_enabled: bool
    mfa_secret: str

    class Setting:
        name = "user"

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    phone: str

class UserLogin(BaseModel):
    email: str
    password: str