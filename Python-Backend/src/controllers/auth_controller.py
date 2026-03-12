from src.Model.user_model import User, UserRegister, UserLogin, AddToActivityRequest
from src.Model.meeting_model import Meeting
from fastapi import HTTPException, status
from passlib.context import CryptContext
import uuid
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

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
