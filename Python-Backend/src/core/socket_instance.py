import socketio
from src.core.config import settings

sio = socketio.AsyncServer(cors_allowed_origins=[settings.FRONTEND_URL], async_mode='asgi')
