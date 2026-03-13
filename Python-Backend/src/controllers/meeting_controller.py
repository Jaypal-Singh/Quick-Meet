from datetime import datetime
from src.Model.meeting_model import Meeting, MeetingCreate
from src.Model.user_model import User
from fastapi import HTTPException, status
import uuid

async def schedule_meeting(meeting_data: MeetingCreate):
    # Find user by token
    user = await User.find_one(User.token == meeting_data.token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    meeting = Meeting(
        user_id=user.username,
        meetingCode=str(uuid.uuid4())[:8],
        title=meeting_data.title,
        description=meeting_data.description,
        startTime=meeting_data.startTime,
        endTime=meeting_data.endTime,
        participants=meeting_data.participants
    )
    await meeting.create()
    return {"message": "Meeting scheduled successfully", "meeting_code": meeting.meetingCode}

async def update_meeting(meeting_code: str, meeting_data: MeetingCreate):
    user = await User.find_one(User.token == meeting_data.token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    meeting = await Meeting.find_one(Meeting.meetingCode == meeting_code)
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    
    if meeting.user_id != user.username:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this meeting")
    
    await meeting.update({"$set": {
        "title": meeting_data.title,
        "description": meeting_data.description,
        "startTime": meeting_data.startTime,
        "endTime": meeting_data.endTime,
        "participants": meeting_data.participants
    }})
    
    return {"message": "Meeting updated successfully"}

async def delete_meeting(meeting_code: str, token: str):
    user = await User.find_one(User.token == token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    meeting = await Meeting.find_one(Meeting.meetingCode == meeting_code)
    if not meeting:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    
    if meeting.user_id != user.username:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this meeting")
    
    await meeting.delete()
    return {"message": "Meeting deleted successfully"}

async def get_user_meetings(token: str):
    user = await User.find_one(User.token == token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    # Find meetings where the user is either the creator OR a participant
    meetings = await Meeting.find({
        "$or": [
            {"user_id": user.username},
            {"participants": user.username}
        ]
    }).to_list()
    return meetings
