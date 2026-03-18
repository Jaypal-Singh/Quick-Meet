from fastapi import HTTPException, status
from src.Model.notification_model import Notification
from src.Model.user_model import User
from bson import ObjectId

async def get_notifications(token: str):
    user = await User.find_one(User.token == token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    # Sort by timestamp descending
    notifications = await Notification.find(Notification.recipient_username == user.username).sort(-Notification.timestamp).to_list()
    return notifications

async def mark_read(notification_id: str, token: str):
    user = await User.find_one(User.token == token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
    try:
        obj_id = ObjectId(notification_id)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid notification ID")
        
    notification = await Notification.get(obj_id)
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
        
    if notification.recipient_username != user.username:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        
    await notification.delete()
    return {"message": "Notification deleted"}

async def mark_all_read(token: str):
    user = await User.find_one(User.token == token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
    await Notification.find(
        Notification.recipient_username == user.username
    ).delete()
    
    return {"message": "All notifications deleted"}
