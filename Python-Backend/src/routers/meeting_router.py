from fastapi import APIRouter, status
from src.Model.meeting_model import MeetingCreate
from src.controllers import meeting_controller

router = APIRouter()

@router.post("/schedule", status_code=status.HTTP_201_CREATED)
async def schedule_meeting(meeting_data: MeetingCreate):
    return await meeting_controller.schedule_meeting(meeting_data)

@router.put("/{meeting_code}")
async def update_meeting(meeting_code: str, meeting_data: MeetingCreate):
    return await meeting_controller.update_meeting(meeting_code, meeting_data)

@router.delete("/{meeting_code}")
async def delete_meeting(meeting_code: str, token: str):
    return await meeting_controller.delete_meeting(meeting_code, token)

@router.get("/")
async def get_user_meetings(token: str):
    return await meeting_controller.get_user_meetings(token)

@router.post("/{meeting_code}/respond")
async def respond_to_meeting(meeting_code: str, action: str, token: str):
    return await meeting_controller.respond_to_meeting(meeting_code, action, token)
