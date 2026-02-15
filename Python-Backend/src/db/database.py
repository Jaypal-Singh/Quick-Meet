from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from src.Model.user_model import User
from src.Model.meeting_model import Meeting
from src.core.config import settings

async def init_db():
    client = AsyncIOMotorClient(settings.MONGO_URL)
    await init_beanie(database=client.QuickMeetCluster, document_models=[User, Meeting])
