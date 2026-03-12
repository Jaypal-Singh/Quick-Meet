from beanie import Document
from datetime import datetime
from pydantic import Field, BaseModel
from typing import Optional

class Meeting(Document):
    user_id: str
    meetingCode: str
    title: str = "Joined Meeting"
    description: str | None = None
    startTime: datetime = Field(default_factory=datetime.now)
    endTime: datetime = Field(default_factory=datetime.now)
    participants: list[str] = []
    date: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "meetings"

class MeetingCreate(BaseModel):
    token: str
    title: str
    description: Optional[str] = None
    startTime: datetime
    endTime: datetime
    participants: list[str] = []
