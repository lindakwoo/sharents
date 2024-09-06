from fastapi import APIRouter, HTTPException, status
from typing import List

from .schemas import MemberModel, MemberModelUpdate
from .member_service import (
    create_member,
    get_member_by_id,
    get_all_members,
    update_member,
    delete_member,
    accept_member_invitation,
)

router = APIRouter()


# Route to create a new member
@router.post(
    "/members/", response_model=MemberModel, status_code=status.HTTP_201_CREATED
)
async def create_member_route(member: MemberModelUpdate, guardian_id: str):
    """
    Creates a new member and returns the created member model.

    Args:
        member: The member data to create.
        guardian_id: The ID of the guardian inviting the member.

    Returns:
        The created member model.
    """
    return await create_member(member, guardian_id)


# Route to retrieve a member by ID
@router.get(
    "/members/{member_id}", response_model=MemberModel, response_model_by_alias=False
)
async def get_member_route(member_id: str):
    """
    Retrieves a member by their ID.

    Args:
        member_id: The ID of the member to retrieve.

    Returns:
        The member model.
    """
    return await get_member_by_id(member_id)


# Route to update a member's information
@router.put(
    "/members/{member_id}", response_model=MemberModel, response_model_by_alias=False
)
async def update_member_route(member_id: str, member_update: MemberModelUpdate):
    """
    Updates a member's information.

    Args:
        member_id: The ID of the member to update.
        member_update: The updated member data.

    Returns:
        The updated member model.
    """
    return await update_member(member_id, member_update)


# Route to delete a member
@router.delete("/members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_member_route(member_id: str):
    """
    Deletes a member by their ID.

    Args:
        member_id: The ID of the member to delete.
    """
    await delete_member(member_id)
    return None


# Route to get all members
@router.get(
    "/members/", response_model=List[MemberModel], response_model_by_alias=False
)
async def get_all_members_route():
    """
    Retrieves all members.

    Returns:
        A list of member models.
    """
    return await get_all_members()


# Route to accept a member invitation
@router.put("/members/{member_id}/accept", response_model=MemberModel)
async def accept_member_invitation_route(member_id: str):
    """
    Accepts a member invitation.

    Args:
        member_id: The ID of the member to accept.

    Returns:
        The updated member model.
    """
    return await accept_member_invitation(member_id)
