from dotenv import load_dotenv
import os

load_dotenv()

class Setting():
    MONGO_URI : str = os.getenv("MONGO_URI")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME")
    DEV_SERVER: str = os.getenv("LOCAL_DEV_SERVER")
    JWT_SECRET: str = os.getenv("JWT_SECRET")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM")
    JWT_TOKEN_EXPIRY: int = os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES")
    PHONE_ID: str = os.getenv("PHONE_NUMBER_ID")
    WA_ACC_ID: str = os.getenv("WA_BUSINESS_ACC_ID")
    WA_ACCESS_TOKEN: str = os.getenv("WA_BUSINESS_ACCESS_TOKEN")
    WHATSAPP_API_URL: str = os.getenv("WHATSAPP_API_URL")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

setting = Setting()