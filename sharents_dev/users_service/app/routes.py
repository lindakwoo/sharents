from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from .models import User, Guardian, Member
from .schemas import UserCreateSchema, UserResponseSchema
from .database import db

router = APIRouter()

# @router.post("/", response_model=UserResponseSchema)
# async def create_user(user: UserCreateSchema):
#     user_dict = user.dict()
#     result = await db["users"].insert_one(user_dict)
#     user_dict["_id"] = str(result.inserted_id)
#     return user_dict

@router.get(
    "/guardians",
    response_description="List all user",
    response_model=UserResponseSchema,
    response_model_by_alias=False,
)
async def get_guardians():
    guardian_collection = db.get_collection("guardians")
    return UserResponseSchema(guardians=await guardian_collection.find().to_list(1000))

# @app.get(
#     "/users/",
#     response_description="List all user",
#     response_model=UserCollection,
#     response_model_by_alias=False,
# )
# async def list_user():
#     """
#     List all of the student data in the database.

#     The response is unpaginated and limited to 1000 results.
#     """
#     return UserCollection(users=await user_collection.find().to_list(1000))

# @router.get("/{user_id}", response_model=UserResponseSchema)
# async def get_user(user_id: str):
#     user = await db["users"].find_one({"_id": ObjectId(user_id)})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return UserResponseSchema(id=str(user["_id"]), **user)