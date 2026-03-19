from fastapi import APIRouter
from src.controllers import notification_controller

router = APIRouter()

@router.get("/")
async def get_notifications(token: str):
    return await notification_controller.get_notifications(token)

@router.put("/read-all")
async def mark_all_read(token: str):
    return await notification_controller.mark_all_read(token)

@router.put("/{notification_id}/read")
async def mark_read(notification_id: str, token: str):
    return await notification_controller.mark_read(notification_id, token)

@router.post("/{notification_id}/respond")
async def respond_to_invite(notification_id: str, action: str, token: str):
    return await notification_controller.respond_to_invite(notification_id, action, token)
