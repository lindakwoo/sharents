from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from .models import Media, Milestone, Category, Comment
from .schemas import MediaCollection, MilestoneCollection, CategoryCollection, CommentCollection
from .database import db

router = APIRouter()

# @router.post("/", response_model=UserResponseSchema)
# async def create_user(user: UserCreateSchema):
#     user_dict = user.dict()
#     result = await db["users"].insert_one(user_dict)
#     user_dict["_id"] = str(result.inserted_id)
#     return user_dict

# @router.get("/", response_model=List[UserResponseSchema])
# async def get_users():
#     users = await db["users"].find().to_list(100)
#     return [UserResponseSchema(id=str(user["_id"]), **user) for user in users]

# @router.get("/{user_id}", response_model=UserResponseSchema)
# async def get_user(user_id: str):
#     user = await db["users"].find_one({"_id": ObjectId(user_id)})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return UserResponseSchema(id=str(user["_id"]), **user)