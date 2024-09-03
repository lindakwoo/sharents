from .models import InviteModel
from typing import List
from .database import db
from .utils import (
    check_for_none,
    create_safe_token,
    decode_url_safe_token,
)
from .schemas import (
    InviteModel,
    InviteCollection,
    CreateInviteModel,
)
from bson import ObjectId
from fastapi import HTTPException
import os
from .mail import mail, create_message
from .member_service import create_member


async def create_invite(invite: CreateInviteModel) -> InviteModel:
    invite_collection = db.get_collection("invites")
    check_for_none(invite_collection, "Invite collection not found")
    invite_dict = invite.model_dump()
    invite_dict["accepted"] = False
    result = await invite_collection.insert_one(invite_dict)
    new_invite = await invite_collection.find_one({"_id": result.inserted_id})
    return InviteModel(**new_invite)


async def create_invites(invites: List[CreateInviteModel]) -> InviteCollection:
    created_invites = []
    for invite in invites:
        new_invite = await create_invite(invite)
        created_invites.append(new_invite)
    return InviteCollection(invites=created_invites)


async def send_invite(member_data, guardian_id: str, children: List[str]):
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "Guardian collection not found")
    guardian = await guardian_collection.find_one({"_id": ObjectId(guardian_id)})
    if guardian is None:
        raise HTTPException(status_code=404, detail="Guardian not found")
    new_member = await create_member(member_data, guardian_id)
    invites = await create_invites(guardian_id, str(new_member.id), children)
    email = member_data.email
    token = create_safe_token({"email": email})
    link = f"http://{os.getenv('DOMAIN')}/member_signup/{new_member.id}/{token}"
    html = f"""
    <h1>Welcome to the app</h1>
    <p>Click here <a href="{link}">link</a> to accept your invitation</p>
    """
    message = create_message(
        recipients=[email], subject="Accept your invitation", body=html
    )
    await mail.send_message(message)
    return {"message": "Account created!", "member": email, "invites": invites}


async def verify_member_invite(member_id: str, token: str):
    token_data = decode_url_safe_token(token)
    if token_data:
        # Implement the logic to verify and accept the invitation
        # This might involve updating the member's status in the database
        return {"message": "Invitation verified and accepted", "member": member_id}
    else:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
