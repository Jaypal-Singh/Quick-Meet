from beanie import Document
from pydantic import Field
from typing import List

class Friend(Document):
    user_id: str
    friends: List[str] = Field(default_factory=list)

    class Settings:
        name = "friends"
