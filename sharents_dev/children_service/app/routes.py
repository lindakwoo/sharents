from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from .models import Child
from .schemas import ChildrenCollection, ChildModel
from .database import db, db_invites

router = APIRouter()

# get all children for the member
@router.get(
    "/members/{member_id}/children/",
    response_description="List all children for memeber",
    response_model=ChildrenCollection,
    response_model_by_alias=False,
)
async def list_children_for_member(member_id: str):
    invite_collection = db_invites.get_collection("invites")
    invites_cursor = invite_collection.find({"member": member_id})
    invites = await invites_cursor.to_list(length=1000)
    child_ids = []
    for invite in invites:
        child_ids.append(invite["child"])
    object_ids = [ObjectId(cid) for cid in child_ids]
    children = []
    for child_id in object_ids:
        child = await db.get_collection("children").find_one({"_id": child_id})
        child_model = ChildModel(**child)  # Convert to ChildModel
        children.append(child_model)
    return ChildrenCollection(children=children)






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