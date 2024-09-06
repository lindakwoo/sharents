from .database import db
from .utils import check_for_none
from .schemas import MemberModel, MemberModelUpdate
from bson import ObjectId


async def create_member(member: MemberModelUpdate, guardian_id: str) -> MemberModel:
    member_collection = db.get_collection("members")
    check_for_none(member_collection, "Member collection not found")

    member_data = member.model_dump()
    member_data.update(
        {
            "invited_by": guardian_id,
            "accepted_invitation": False,
            "signed_up": False,
            "username": "",
            "hashed_password": "",
        }
    )

    result = await member_collection.insert_one(member_data)
    new_member = await member_collection.find_one({"_id": result.inserted_id})
    check_for_none(new_member, "Member not found after creation")

    return MemberModel(**new_member)


async def accept_member_invitation(member_id: str) -> MemberModel:
    member_collection = db.get_collection("members")
    invite_collection = db.get_collection("invites")

    # Update member
    update_result = await member_collection.update_one(
        {"_id": ObjectId(member_id)}, {"$set": {"accepted_invitation": True}}
    )
    if update_result.modified_count == 0:
        check_for_none(None, "Member not found or invitation already accepted")

    # Update invites
    await invite_collection.update_many(
        {"member": member_id}, {"$set": {"accepted": True}}
    )

    # Fetch updated member
    updated_member = await member_collection.find_one({"_id": ObjectId(member_id)})
    check_for_none(updated_member, "Member not found after update")

    return MemberModel(**updated_member)
