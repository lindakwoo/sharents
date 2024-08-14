from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
load_dotenv()
from bson import ObjectId
import os
DATABASE_URL = os.getenv("ATLAS_URI")
client = AsyncIOMotorClient(DATABASE_URL)

db = client.get_database("milestones_media")
