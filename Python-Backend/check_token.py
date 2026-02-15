
import asyncio
from src.db.database import init_db
from src.Model.user_model import User

async def check_user_token():
    await init_db()
    users = await User.find_all().to_list()
    for user in users:
        print(f"User: {user.username}, Token: {user.token}")

if __name__ == "__main__":
    asyncio.run(check_user_token())
