import firebase_admin
from firebase_admin import credentials, messaging
import os
import json
import base64
from typing import Dict, Any, Optional
from src.Model.notification_model import Notification
from src.core.config import settings

# Initialize Firebase Admin SDK
try:
    if settings.FIREBASE_CREDENTIALS_BASE64:
        cred_dict = json.loads(base64.b64decode(settings.FIREBASE_CREDENTIALS_BASE64).decode('utf-8'))
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        print("Firebase Admin initialized successfully from environment variable.")
    else:
        cred_path = os.path.join(os.path.dirname(__file__), "..", "services", "firebase-service-account.json")
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print(f"Firebase Admin initialized successfully from {cred_path}")
        else:
            print(f"CRITICAL: Firebase service account file NOT found at {cred_path} and ENV var missing. Push notifications will not be sent.")
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

async def notify_meeting_invite(token: Optional[str], inviter_name: str, inviter_username: str, recipient_username: str, meeting_code: str, meeting_link: str = ""):
    """
    Utility for meeting invitation notifications.
    """
    body = f"{inviter_name} is inviting you to a meeting."
    if meeting_link:
        body += f"\nRoom Link: {meeting_link}"
    
    success = False
    if token:
        success = await send_push_notification(
            token=token,
            title="New Meeting Invite",
            body=body,
            data={
                "type": "meeting_invite",
                "meeting_code": meeting_code,
                "meeting_link": meeting_link,
                "click_action": "FLUTTER_NOTIFICATION_CLICK"
            }
        )
    
    # Always save to database
    try:
        notification_record = Notification(
            recipient_username=recipient_username,
            sender_username=inviter_username,
            title="New Meeting Invite",
            body=body,
            type="meeting_invite",
            data={
                "meeting_code": meeting_code, 
                "meeting_link": meeting_link,
                "inviter_username": inviter_username
            }
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

async def notify_meeting_reminder(token: Optional[str], username: str, title: str, body: str, meeting_code: str):
    """
    Utility for meeting reminder notifications (24h or 30m before).
    """
    success = False
    if token:
        success = await send_push_notification(
            token=token,
            title="Meeting Reminder",
            body=body,
            data={
                "type": "meeting_reminder",
                "meeting_code": meeting_code,
                "click_action": "FLUTTER_NOTIFICATION_CLICK"
            }
        )
    
    # Save to database
    try:
        notification_record = Notification(
            recipient_username=username,
            sender_username="system",
            title="Meeting Reminder",
            body=body,
            type="meeting_reminder",
            data={
                "meeting_code": meeting_code
            }
        )
        await notification_record.create()
    except Exception as e:
        print(f"Error saving reminder to DB: {e}")
        
    return success
