from fastapi import APIRouter, HTTPException, status
from typing import List

from .models import User, MemberModel, InviteModel
from .schemas import (
    UserCreate,
    UserModel,
    UserCollection,
    MemberModelUpdate,
    InviteCollection,
    Token,
    CreateInviteModel,
    LoginModel,
    GuardianModel,
)


from datetime import timedelta

router = APIRouter()


# Route to create a new member
@router.post(
    "/members/", response_model=MemberModel, status_code=status.HTTP_201_CREATED
)
async def create_member_route(member: MemberCreate):
    """
    Create a new member.
    """
    return await create_member(member)


# Route to retrieve a member by ID
@router.get(
    "/members/{member_id}", response_model=MemberModel, response_model_by_alias=False
)
async def get_member_route(member_id: str):
    """
    Retrieve a member by their ID.
    """
    return await get_member_by_id(member_id)


# Route to update a member's information
@router.put(
    "/members/{member_id}", response_model=MemberModel, response_model_by_alias=False
)
async def update_member_route(member_id: str, member_update: MemberModelUpdate):
    """
    Update a member's information.
    """
    return await update_member(member_id, member_update.dict())


# Route to delete a member
@router.delete("/members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_member_route(member_id: str):
    """
    Delete a member by their ID.
    """
    await delete_member(member_id)
    return None


# Route to get all members
@router.get(
    "/members/", response_model=List[MemberModel], response_model_by_alias=False
)
async def get_all_members_route():
    """
    Retrieve all members.
    """
    return await get_all_members()


# Add additional routes for member-specific functionalities (e.g., accepting invites)
# ...
