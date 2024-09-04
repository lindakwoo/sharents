from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

from .database import db
from .utils import check_for_none
from .schemas import MemberModel, MemberModelUpdate
from bson import ObjectId


async def create_member(member: MemberModelUpdate, guardian_id: str) -> MemberModel:
    """
    Creates a new member and returns the created member model.

    Args:
        member: The member data to create.
        guardian_id: The ID of the guardian inviting the member.

    Returns:
        The created member model.
    """

    member_collection = db.get_collection("members")
    check_for_none(member_collection, "Member collection not found")

    member_data = member.dict()  # Use dict() to get a dictionary representation
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


async def get_member_by_id(member_id: str) -> MemberModel:
    """
    Retrieves a member by their ID.

    Args:
        member_id: The ID of the member to retrieve.

    Returns:
        The member model.
    """

    member_collection = db.get_collection("members")
    member = await member_collection.find_one({"_id": ObjectId(member_id)})
    check_for_none(member, "Member not found")

    return MemberModel(**member)


async def get_all_members() -> List[MemberModel]:
    """
    Retrieves all members.

    Returns:
        A list of member models.
    """

    member_collection = db.get_collection("members")
    members = await member_collection.find().to_list(length=None)

    return [MemberModel(**member) for member in members]


async def update_member(
    member_id: str, member_update: MemberModelUpdate
) -> MemberModel:
    """
    Updates a member's information.

    Args:
        member_id: The ID of the member to update.
        member_update: The updated member data.

    Returns:
        The updated member model.
    """

    member_collection = db.get_collection("members")
    result = await member_collection.update_one(
        {"_id": ObjectId(member_id)}, {"$set": member_update.dict()}
    )
    if result.modified_count == 0:
        check_for_none(None, "Member not found")

    updated_member = await member_collection.find_one({"_id": ObjectId(member_id)})
    check_for_none(updated_member, "Member not found after update")

    return MemberModel(**updated_member)


async def delete_member(member_id: str) -> None:
    """
    Deletes a member by their ID.

    Args:
        member_id: The ID of the member to delete.
    """

    member_collection = db.get_collection("members")
    result = await member_collection.delete_one({"_id": ObjectId(member_id)})
    if result.deleted_count == 0:
        check_for_none(None, "Member not found")


async def accept_member_invitation(member_id: str) -> MemberModel:
    """
    Accepts a member invitation.

    Args:
        member_id: The ID of the member to accept.

    Returns:
        The updated member model.
    """

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
