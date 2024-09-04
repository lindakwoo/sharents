from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("ATLAS_URI")
print("url", DATABASE_URL)
client = AsyncIOMotorClient(DATABASE_URL)

db = client.get_database("users")
