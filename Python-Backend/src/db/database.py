from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from src.Model.user_model import User
from src.Model.meeting_model import Meeting
from src.Model.friend_model import Friend
from src.Model.notification_model import Notification
from src.core.config import settings

async def init_db():
    client = AsyncIOMotorClient(settings.MONGO_URL)
    await init_beanie(database=client[settings.MONGO_DB_NAME], document_models=[User, Meeting, Friend, Notification])
