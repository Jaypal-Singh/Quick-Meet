from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_headers=["*"],
    allow_credentials=True,        
    allow_methods=["*"],
)

sio = socketio.AsyncServer(cors_allowed_origins="*", async_mode='asgi')
socketio_app = socketio.ASGIApp(sio ,app)

from src.controllers.Socket_Controller import register_socket_events
register_socket_events(sio)

from src.db.database import init_db
@app.on_event("startup")
async def startup_event():
    await init_db()


app.include_router(auth_router.router, prefix="/api/v1/users")

@app.get("/")
def read_root():
    return {"message": "CORS is configured!"}

