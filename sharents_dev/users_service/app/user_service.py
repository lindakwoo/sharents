from bson import ObjectId
from .models import User, MemberModel, GuardianModel
from .schemas import UserCreate, UserModel, MemberModelUpdate, GuardianModel
from .database import db
from .utils import check_for_none, check_update_result
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

    hashed_password = get_password_hash("123")
    user_dict = user.dict()
    user_dict["hashed_password"] = hashed_password
    user_dict["role"] = "guardian"  # Set role to "guardian" explicitly
    del user_dict["password"]

    # Generate a new ObjectId and set it as _id
    user_dict["_id"] = ObjectId()

    result = await user_collection.insert_one(user_dict)
    new_user = user_dict  # No need to find again as _id is included

    # Create a corresponding guardian object in the guardians collection
    guardian_collection = db.get_collection("guardians")
    guardian_data = {
        "name": user.name,
        "email": user.email,
        "username": user.username,
        "hashed_password": hashed_password,
    }
    guardian_result = await guardian_collection.insert_one(guardian_data)
    new_guardian = await guardian_collection.find_one(
        {"_id": guardian_result.inserted_id}
    )
    check_for_none(new_guardian, "Guardian object not found after creation")

    # Update the user document with the guardian_id
    await user_collection.update_one(
        {"_id": new_user["_id"]}, {
            "$set": {"guardian_id": new_guardian["_id"]}}
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
        update_data["hashed_password"] = get_password_hash(
            update_data["password"])
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
        raise HTTPException(
            status_code=404, detail="User not found or no changes made")

    updated_user = await user_collection.find_one({"_id": ObjectId(user_id)})
    return UserModel(**updated_user)


async def delete_user(user_id: str):
    user_collection = db.get_collection("users")
    check_for_none(user_collection, "User collection not found")

    delete_result = await user_collection.delete_one({"_id": ObjectId(user_id)})

    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")


async def list_users() -> list[UserModel]:
    user_collection = db.get_collection("users")
    check_for_none(user_collection, "User collection not found")

    users = await user_collection.find().to_list(1000)
    return [UserModel(**user) for user in users]


async def create_member_user(
    member: MemberModelUpdate, member_id: str
) -> MemberModel:

    update_member_data = member.model_dump()
    hashed_password = get_password_hash(update_member_data["password"])
    update_member_data["signed_up"] = True
    update_member_data['hashed_password'] = hashed_password
    del update_member_data['password']
    del update_member_data['role']

    update_result = await db.get_collection("members").update_one(
        {"_id": ObjectId(member_id)}, {
            "$set": update_member_data}
    )
    check_update_result(
        update_result, "Member not found or no changes applied")
    updated_member = await db.get_collection("members").find_one({"_id": ObjectId(member_id)})
    check_for_none(updated_member, "Member not found after update")

    user_collection = db.get_collection("users")
    check_for_none(user_collection, "User collection not found")
    member_data = member.model_dump()
    member_data["hashed_password"] = hashed_password
    member_data["role"] = "member"
    del member_data["password"]

    result = await user_collection.insert_one(member_data)
    new_user = await user_collection.find_one({"_id": result.inserted_id})
    check_for_none(new_user, "User not found after creation")

    await user_collection.update_one(
        {"_id": new_user["_id"]}, {
            "$set": {"member_id": updated_member["_id"]}}
    )

    return UserModel(**new_user)


async def accept_member_invitation(member_id: str) -> MemberModel:
    user_collection = db.get_collection("users")
    check_for_none(user_collection, "User collection not found")

    result = await user_collection.update_one(
        {"_id": ObjectId(member_id), "role": "member"},
        {"$set": {"accepted_invitation": True}},
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=404, detail="Member not found or invitation already accepted"
        )

    updated_member = await user_collection.find_one({"_id": ObjectId(member_id)})
    return MemberModel(**updated_member)
