from pydantic import BaseModel

class UpdateFCMTokenRequest(BaseModel):
    token: str
    fcm_token: str
