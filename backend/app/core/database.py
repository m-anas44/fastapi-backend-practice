from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import setting
from beanie import init_beanie
from app.models.message import Message
from app.models.random_data import Random
from app.models.user import User

client: AsyncIOMotorClient = None

async def init_db():
    client = AsyncIOMotorClient(setting.MONGO_URI)

    db = client[setting.MONGO_DB_NAME]
    
    await init_beanie(
        database=db,
        document_models=[Message, Random, User]
    )