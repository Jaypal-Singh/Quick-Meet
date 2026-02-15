from fastapi import APIRouter, status, Body
from src.Model.user_model import UserRegister, UserLogin, AddToActivityRequest
from src.controllers import auth_controller

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserRegister):
    return await auth_controller.register(user_data)

@router.post("/login")
async def login_user(user_data: UserLogin):
    return await auth_controller.login(user_data)

@router.post("/add_to_activity")
async def add_to_activity(user_data: AddToActivityRequest):
    return await auth_controller.add_to_activity(user_data)

@router.get("/get_all_activity")
async def get_all_activity(token: str):
    return await auth_controller.get_all_activity(token)
