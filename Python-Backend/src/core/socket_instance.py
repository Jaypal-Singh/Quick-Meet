import socketio
from src.core.config import settings

sio = socketio.AsyncServer(cors_allowed_origins=["http://localhost:3000", "https://quick-meet-coral.vercel.app"], async_mode='asgi')
