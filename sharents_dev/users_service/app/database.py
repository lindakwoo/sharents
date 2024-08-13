from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
DATABASE_URL = os.getenv("ATLAS_URI")
client = AsyncIOMotorClient(DATABASE_URL)

db = client.get_database("users")

# user_collection = db.get_collection("users")

# async def connect_db():
#     global client, db
#     client = AsyncIOMotorClient(DATABASE_URL)
#     db = client.get_database()

# async def close_db():
#     client.close()