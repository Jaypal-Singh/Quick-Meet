from src.utils.notification_util import notify_meeting_invite
from pydantic import BaseModel
from typing import List, Optional
from fastapi import HTTPException, status
from src.Model.user_model import User
from src.Model.friend_model import Friend

class InviteRequest(BaseModel):
    token: str
    friend_username: str
    meeting_code: str

class AddFriendRequest(BaseModel):
    token: str
    friend_username: str

async def search_users(query: str):
    # Search for users by name or username, limiting results
    users = await User.find({"$or": [
        {"username": {"$regex": query, "$options": "i"}},
        {"name": {"$regex": query, "$options": "i"}}
    ]}).limit(10).to_list()
    
    return [{"name": u.name, "username": u.username} for u in users]

async def add_friend(data: AddFriendRequest):
    # Verify user by token
    user = await User.find_one(User.token == data.token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    # Check if friend exists
    friend_user = await User.find_one(User.username == data.friend_username)
    if not friend_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if friend_user.username == user.username:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot add yourself as a friend")

    # Get or create friend record
    friend_record = await Friend.find_one(Friend.user_id == user.username)
    if not friend_record:
        friend_record = Friend(user_id=user.username, friends=[])
        await friend_record.create()
    
    if data.friend_username in friend_record.friends:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is already in your friend list")
    
    friend_record.friends.append(data.friend_username)
    await friend_record.save()
    
    return {"message": "Friend added successfully"}

async def get_friends_list(token: str):
    user = await User.find_one(User.token == token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    friend_record = await Friend.find_one(Friend.user_id == user.username)
    if not friend_record:
        return []
    
    # Get details of each friend
    friends_details = []
    for f_username in friend_record.friends:
        f_user = await User.find_one(User.username == f_username)
        if f_user:
            friends_details.append({"name": f_user.name, "username": f_user.username})
            
    return friends_details

async def invite_to_meeting(data: InviteRequest):
    # Verify sender
    sender = await User.find_one(User.token == data.token)
    if not sender:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    # Get friend details (specifically their fcm_token)
    friend = await User.find_one(User.username == data.friend_username)
    if not friend:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Friend not found")
    
    if not friend.fcm_token:
        # We can't send a push if they don't have a token.
        return {"message": f"Cannot invite {data.friend_username}: They haven't enabled notifications yet.", "sent": False}

    # Send notification
    try:
        success = await notify_meeting_invite(
            token=friend.fcm_token,
            inviter_name=sender.name,
            inviter_username=sender.username,
            recipient_username=friend.username,
            meeting_code=data.meeting_code
        )
        
        if success:
            return {"message": "Invite sent successfully", "sent": True}
        else:
            return {"message": "Firebase failed to deliver the notification. Check backend logs.", "sent": False}
    except Exception as e:
        print(f"Error in invite_to_meeting: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"Notification error: {str(e)}"
        )
