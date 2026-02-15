from beanie import Document
from datetime import datetime
from pydantic import Field

class Meeting(Document):
    user_id: str
    meetingCode: str
    date: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "meetings"
