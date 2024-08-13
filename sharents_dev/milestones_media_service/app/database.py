# from motor.motor_asyncio import AsyncIOMotorClient
# from bson import ObjectId
# import os
# DATABASE_URL = os.getenv("DATABASE_URL", "mongodb://localhost:27017/milestones_media_service")
# client: AsyncIOMotorClient = None
# db = None

# async def connect_db():
#     global client, db
#     client = AsyncIOMotorClient(DATABASE_URL)
#     db = client.get_database()

# async def close_db():
#     client.close()
