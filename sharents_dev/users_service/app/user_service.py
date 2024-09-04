from bson import ObjectId
from .models import User, MemberModel
from .schemas import UserCreate, UserModel, MemberModelUpdate, MemberUserCreate
from .database import db
from .utils import check_for_none
from .auth import get_password_hash


async def create_user(user: UserCreate) -> UserModel:
    user_collection = db.get_collection("users")
    check_for_none(user_collection, "User collection not found")

    if not user.username or user.username.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username cannot be empty"
        )

    existing_user = await user_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    user_dict["role"] = "guardian"  # Set role to "guardian" explicitly
    del user_dict["password"]

    # Generate a new ObjectId and set it as _id
    user_dict["_id"] = ObjectId()

    result = await user_collection.insert_one(user_dict)
    new_user = user_dict  # No need to find again as _id is included

    # Update the user document with the guardian_id (optional)
    if user.role == "guardian":
        await user_collection.update_one(
            {"_id": new_user["_id"]}, {"$set": {"guardian_id": new_user["_id"]}}
        )

    return UserModel(**new_user)


async def get_user_by_id(user_id: str) -> UserModel:
    user_collection = db.get_collection("users")
    check_for_none(user_collection, "User collection not found")

    user = await user_collection.find_one({"_id": ObjectId(user_id)})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return UserModel(**user)


async def update_user(user_id: str, user_update: UserCreate) -> UserModel:
    user_collection = db.get_collection("users")
    check_for_none(user_collection, "User collection not found")

    existing_user = await user_collection.find_one({"_id": ObjectId(user_id)})
    if existing_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = user_update.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data["password"])
        del update_data["password"]

    if (
        "username" in update_data
        and update_data["username"] != existing_user["username"]
    ):
        existing_username = await user_collection.find_one(
            {"username": update_data["username"]}
        )
        if existing_username:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken"
            )

    result = await user_collection.update_one(
        {"_id": ObjectId(user_id)}, {"$set": update_data}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found or no changes made")

    updated_user = await user_collection.find_one({"_id": ObjectId(user_id)})
    return UserModel(**updated_user)


async def delete_user(user_id: str):
    user_collection = db.get_collection("users")
    check_for_none(user_collection, "User collection not found")

    delete_result = await user_collection.delete_one({"_id": ObjectId(user_id)})

    if delete_result.deleted_count == 0:  # Added missing colon
        raise HTTPException(status_code=404, detail="User not found")
