import requests
from src.Model.user_model import User, UserRegister, UserLogin, AddToActivityRequest, GoogleLoginRequest
from src.Model.meeting_model import Meeting
from fastapi import HTTPException, status
from passlib.context import CryptContext
import uuid
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def google_login(request: GoogleLoginRequest):
    # Verify access token with Google
    response = requests.get(f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={request.access_token}")
    
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google token"
        )
    
    user_info = response.json()
    email = user_info.get("email")
    name = user_info.get("name")
    
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email not found in Google account"
        )
    
    # Check if user exists
    user = await User.find_one(User.username == email)
    
    if not user:
        # Create new user if not exists
        user = User(
            name=name,
            username=email,
            password=get_password_hash(str(uuid.uuid4())) # Hash the random password
        )
        await user.create()
    
    # Generate token
    token = str(uuid.uuid4())
    user.token = token
    await user.save()
    
    return {
        "message": "Login successful",
        "token": token,
        "email": email,
        "name": name
    }

def verify_password(plain_password, hashed_password):
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        print(f"Error verifying password: {e}")
        return False

def get_password_hash(password):
    return pwd_context.hash(password)

async def register(user_data: UserRegister):
    # Check if username already exists
    existing_user = await User.find_one(User.username == user_data.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Hash the password
    hashed_password = get_password_hash(user_data.password)
    
    # Create new user
    new_user = User(
        name=user_data.name,
        username=user_data.username,
        password=hashed_password
    )
    
    await new_user.create()
    
    return {"message": "User registered successfully"}

async def login(user_data: UserLogin): # Reusing UserRegister for now as it has username/password
    user = await User.find_one(User.username == user_data.username)
    if not user or not verify_password(user_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
    
    token = str(uuid.uuid4())
    user.token = token
    await user.save()
    
    return {"message": "Login successful", "token": token}


async def add_to_activity(user_data: AddToActivityRequest):
    token = user_data.token
    meeting_code = user_data.meeting_code
    
    user = await User.find_one(User.token == token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        
    # new_meeting = Meeting(user_id=user.username, meetingCode=meeting_code)

    new_meeting = Meeting(
        user_id=user.username, 
        meetingCode=meeting_code,
        title="Joined Meeting",
        startTime=datetime.now(),
        endTime=datetime.now()
    )
    
    await new_meeting.create()
    return {"message": "Meeting added to activity"}

async def get_all_activity(token: str):
    user = await User.find_one(User.token == token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    meetings = await Meeting.find(Meeting.user_id == user.username).to_list()
    return meetings

async def update_fcm_token(token: str, fcm_token: str):
    user = await User.find_one(User.token == token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    user.fcm_token = fcm_token
    await user.save()
    return {"message": "FCM token updated successfully"}

