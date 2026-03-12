from fastapi import APIRouter, status, Query
from src.controllers import friend_controller
from src.controllers.friend_controller import AddFriendRequest, InviteRequest

router = APIRouter()

@router.get("/search")
async def search_users(query: str = Query(...)):
    return await friend_controller.search_users(query)

@router.post("/add", status_code=status.HTTP_200_OK)
async def add_friend(data: AddFriendRequest):
    return await friend_controller.add_friend(data)

@router.post("/invite")
async def invite_friend(data: InviteRequest):
    return await friend_controller.invite_to_meeting(data)

@router.get("/list")
async def get_friends(token: str = Query(...)):
    return await friend_controller.get_friends_list(token)
