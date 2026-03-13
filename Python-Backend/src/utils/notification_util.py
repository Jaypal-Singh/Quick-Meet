import firebase_admin
from firebase_admin import credentials, messaging
import os
from typing import Dict, Any, Optional
from src.Model.notification_model import Notification

# Initialize Firebase Admin SDK
# ... (existing initialization code)
try:
    cred_path = os.path.join(os.path.dirname(__file__), "..", "services", "firebase-service-account.json")
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        print(f"Firebase Admin initialized successfully from {cred_path}")
    else:
        print(f"CRITICAL: Firebase service account file NOT found at {cred_path}. Push notifications will not be sent.")
except Exception as e:
    print(f"CRITICAL Error initializing Firebase Admin: {e}")

async def send_push_notification(
    token: str, 
    title: str, 
    body: str, 
    data: Optional[Dict[str, str]] = None
) -> bool:
    """
    Sends a push notification to a specific device token.
    """
    if not firebase_admin._apps:
        print("Firebase Admin not initialized. Skipping notification.")
        return False

    try:
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data or {},
            token=token,
        )
        response = messaging.send(message)
        print(f"Successfully sent notification: {response}")
        return True
    except Exception as e:
        print(f"Error sending push notification: {e}")
        return False

async def notify_meeting_invite(token: str, inviter_name: str, inviter_username: str, recipient_username: str, meeting_code: str):
    """
    Utility for meeting invitation notifications.
    """
    success = await send_push_notification(
        token=token,
        title="New Meeting Invite",
        body=f"{inviter_name} is inviting you to a meeting.",
        data={
            "type": "meeting_invite",
            "meeting_code": meeting_code,
            "click_action": "FLUTTER_NOTIFICATION_CLICK"
        }
    )
    
    # Save to database
    try:
        notification_record = Notification(
            recipient_username=recipient_username,
            sender_username=inviter_username,
            title="New Meeting Invite",
            body=f"{inviter_name} is inviting you to a meeting.",
            type="meeting_invite",
            data={"meeting_code": meeting_code}
        )
        await notification_record.create()
    except Exception as e:
        print(f"Error saving notification to DB: {e}")
        
    return success

async def notify_new_message(token: str, sender_name: str, sender_username: str, recipient_username: str, message_preview: str):
    """
    Utility for new chat message notifications.
    """
    success = await send_push_notification(
        token=token,
        title=f"New Message from {sender_name}",
        body=message_preview[:100],
        data={"type": "chat_message"}
    )
    
    # Save to database
    try:
        notification_record = Notification(
            recipient_username=recipient_username,
            sender_username=sender_username,
            title=f"New Message from {sender_name}",
            body=message_preview[:100],
            type="chat_message"
        )
        await notification_record.create()
    except Exception as e:
        print(f"Error saving notification to DB: {e}")
        
    return success
