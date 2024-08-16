from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from bson import ObjectId
from .models import Guardian, Member
from .schemas import (
    GuardianCollection,
    GuardianModel,
    GuardianModelCreate,
    EmailModel,
    MemberModel,
    MemberModelCreate,
    InviteModel,
    InviteCollection,
)
from .database import db
from .utils import (
    check_for_none,
    check_list_not_empty,
    create_safe_token,
    decode_url_safe_token,
    check_update_result,
    check_delete_result,
)
from .mail import mail, create_message
import os
import logging


router = APIRouter()


@router.get(
    "/guardians/",
    response_description="List all guardians",
    response_model=GuardianCollection,
    response_model_by_alias=False,
)
async def list_guardians():
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "guardian collections not found")
    guardians = await guardian_collection.find().to_list(1000)
    check_list_not_empty(guardians, "no guardians found")
    return GuardianCollection(guardians=guardians)


@router.post(
    "/guardians/",
    response_description="Create a guardian",
    response_model=GuardianModel,
    response_model_by_alias=False,
    status_code=status.HTTP_201_CREATED,
)
async def create_guardian(guardian: GuardianModelCreate):
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "guardian collections not found")
    result = await guardian_collection.insert_one(guardian.dict())
    new_guardian = await guardian_collection.find_one({"_id": result.inserted_id})
    check_for_none(new_guardian, "Guardian not found after creation")
    return GuardianModel(**new_guardian)


def send_email():
    pass


# create a member


@router.post(
    "/members/",
    response_description="create member",
    response_model=MemberModel,
    response_model_by_alias=False,
)
async def create_member(member: MemberModelCreate, guardian_id: str) -> dict:
    member_collection = db.get_collection("members")
    check_for_none(member_collection, "Member collections not found")

    member_data = member.model_dump()
    member_data["invited_by"] = guardian_id
    member_data["accepted_invitation"] = False
    member_data["signed_up"] = False
    member_data["username"] = ""
    member_data["hashed_password"] = ""

    member_result = await member_collection.insert_one(member_data)
    new_member = await member_collection.find_one({"_id": member_result.inserted_id})
    check_for_none(new_member, "Member not found after creation")

    return MemberModel(**new_member)


# accept a member invitation


@router.put(
    "/members/{member_id}/accept",
    response_description="Accept member invitation",
    response_model=MemberModel,
    response_model_by_alias=False,
)
async def accept_member_invitation(member_id: str) -> dict:
    await db.get_collection("members").update_one({"_id": ObjectId(member_id)}, {"$set": {"accepted_invitation": True}})
    # check_update_result(result, 'member not found')
    updated_member = await db.get_collection('members').find_one({"_id": ObjectId(member_id)})
    check_for_none(updated_member, "Member not found after update")
    invite_collection = db.get_collection("invites")
    invites_cursor = invite_collection.find({"member": member_id})
    invites = await invites_cursor.to_list(length=1000)
    for invite in invites:
        invite['accepted'] = True
        await invite_collection.update_one(
            {"_id": invite["_id"]}, {"$set": {"accepted": True}})

    return MemberModel(**updated_member)

#  create invites per child


@router.post(
    "/invites/",
    response_description="create invites",
    response_model=InviteCollection,
    response_model_by_alias=False,
)
async def create_invites(guardian_id: str, member_id: str, children: List[str]):
    invite_collection = db.get_collection("invites")
    check_for_none(invite_collection, "Invite collections not found")

    invites = []
    for child in children:
        invite = {
            "child": child,
            "guardian": guardian_id,
            "member": member_id,
            "accepted": False,
        }
        invite_result = await invite_collection.insert_one(invite)
        new_invite = await invite_collection.find_one(
            {"_id": invite_result.inserted_id}
        )
        invite = InviteModel(**new_invite)
        invites.append(invite)

    return InviteCollection(invites=invites)


@router.post("/guardians/{guardian_id}/invite")
# type: ignore
async def send_invite(
    member: MemberModelCreate, guardian_id: str, children: List[str]
):

    new_member = await create_member(member, guardian_id)
    await create_invites(guardian_id, str(new_member.id), children)

    email = member.email
    token = create_safe_token({"email": email})
    link = f"http://{os.getenv('DOMAIN')}/verify_invite/{new_member.id}/{token}"
    html = f"""
    <h1>Welcome to the app</h1>
    <p> Click here <a href="{link}"> link<a/> to accept your invitation <p/>"""
    message = create_message(
        recipients=[email], subject="Accept your invitation", body=html)

    await mail.send_message(message)

    return {"message": "Account created!", "member": email}


@router.get("/verify_invite/{member_id}/{token}")
async def verify_member_invite(member_id: str, token: str):
    token_data = decode_url_safe_token(token)
    if token_data:
        print("token is valid!", token_data)
        return {"message": "token verified", "member": member_id}
