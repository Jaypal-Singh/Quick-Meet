from datetime import datetime
from src.Model.meeting_model import Meeting, MeetingCreate
from src.Model.user_model import User
from fastapi import HTTPException, status
import uuid
from src.utils.notification_util import notify_meeting_invite
from src.core.config import settings


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

    # Send notifications to participants
    if meeting_data.participants:
        # participants might be a comma-separated string or list, normalize to list
        import asyncio
        parts = meeting_data.participants
        if isinstance(parts, str):
            parts = [p.strip() for p in parts.split(',') if p.strip()]
            
        async def send_to_participant(p_username: str):
            try:
                p_user = await User.find_one(User.username == p_username)
                await notify_meeting_invite(
                    token=p_user.fcm_token if p_user else None,
                    inviter_name=user.name,
                    inviter_username=user.username,
                    recipient_username=p_username,
                    meeting_code=meeting.meetingCode,
                    meeting_link=f"{settings.FRONTEND_URL}/video-meet?roomID={meeting.meetingCode}"
                )
            except Exception as e:
                print(f"Failed to send schedule notification to {p_username}: {e}")

        # Fire off notifications concurrently
        await asyncio.gather(*(send_to_participant(p) for p in parts))

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
    
    old_participants = meeting.participants
    
    await meeting.update({"$set": {
        "title": meeting_data.title,
        "description": meeting_data.description,
        "startTime": meeting_data.startTime,
        "endTime": meeting_data.endTime,
        "participants": meeting_data.participants
    }})
    
    # Send notifications to newly added participants
    if meeting_data.participants:
        import asyncio
        new_parts = meeting_data.participants
        old_parts_list = []
        
        if isinstance(old_participants, str):
            old_parts_list = [p.strip() for p in old_participants.split(',') if p.strip()]
        elif isinstance(old_participants, list):
            old_parts_list = old_participants
            
        if isinstance(new_parts, str):
            new_parts = [p.strip() for p in new_parts.split(',') if p.strip()]
            
        added_parts = [p for p in new_parts if p not in old_parts_list]
            
        if added_parts:
            async def send_to_participant(p_username: str):
                try:
                    p_user = await User.find_one(User.username == p_username)
                    await notify_meeting_invite(
                        token=p_user.fcm_token if p_user else None,
                        inviter_name=user.name,
                        inviter_username=user.username,
                        recipient_username=p_username,
                        meeting_code=meeting.meetingCode,
                        meeting_link=f"{settings.FRONTEND_URL}/video-meet?roomID={meeting.meetingCode}"
                    )
                except Exception as e:
                    print(f"Failed to send update notification to {p_username}: {e}")

            await asyncio.gather(*(send_to_participant(str(p)) for p in added_parts))
    
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
