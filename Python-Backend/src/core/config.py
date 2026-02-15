from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URL: str = "mongodb+srv://jaypalsinghchouhan2008_db_user:jaypal2005@quickmeetcluster.cf0lzi3.mongodb.net/?appName=QuickMeetCluster"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    SECRET_KEY: str = "secret-key-123456789" # Change this in production
    
    class Config:
        env_file = ".env"

settings = Settings()
