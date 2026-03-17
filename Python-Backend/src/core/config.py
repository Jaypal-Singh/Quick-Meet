from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URL: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    SECRET_KEY: str
    FIREBASE_CREDENTIALS_BASE64: str | None = None
    
    class Config:
        env_file = ".env"

settings = Settings()
