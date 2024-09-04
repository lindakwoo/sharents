from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from typing import List
from pymongo import ASCENDING
from bson import ObjectId

from .schemas import (
    UserCreate,
    UserModel,
    UserCollection,
    MemberModel,
    MemberModelUpdate,
    InviteCollection,
    Token,
    CreateInviteModel,
    LoginModel,
    GuardianModel,
    GuardianModelUpdate,
    EmailModel,
    MemberModel,
    MemberModelCreate,
    InviteModel,
    InviteCollection,
    Token,
    TokenData,

)
from .auth import (
    get_current_user,
    create_access_token,
    authenticate_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from .user_service import (
    create_user,
    get_user_by_id,
    update_user,
    delete_user,
    list_users,
    create_member_user,
)

from .guardian_service import (
    delete_guardian,
    get_all_guardians,
    get_guardian_by_id,
    create_guardian,
    update_guardian,
)
from datetime import timedelta
from .database import db
from .utils import (
    check_for_none,
    create_safe_token,
    decode_url_safe_token,
)
from .mail import mail, create_message
import os
import logging


router = APIRouter()


# Route for member registration
@router.post(
    "/register/member", response_model=UserModel, status_code=status.HTTP_201_CREATED
)
async def register(user: UserCreate):
    """
    Register a new user.
    """
    return await create_member_user(user)


# Route for user registration
@router.post("/register", response_model=UserModel, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate):
    """
    Register a new user.
    """
    return await create_user(user)


@router.post("/token", response_model=Token)
async def login_for_access_token(login_data: LoginModel):
    user = await authenticate_user(login_data.username, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
        "hi": "hi",
    }


# Route to verify user token
@router.get("/verify")
async def verify_token(current_user: UserModel = Depends(get_current_user)):
    """
    Verify the current user's token.
    """
    return {"X-User-ID": str(current_user.id)}


# Route to get a specific user by ID
@router.get("/users/{user_id}", response_model=UserModel, response_model_by_alias=False)
async def get_user(user_id: str, current_user: UserModel = Depends(get_current_user)):
    """
    Retrieve a user by their ID.
    """
    return await get_user_by_id(user_id)


# Route to delete a user
@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user_route(
    user_id: str, current_user: UserModel = Depends(get_current_user)
):
    """
    Delete a user by their ID.
    """
    await delete_user(user_id)
    return None


# Route to update a user's information
@router.put("/users/{user_id}", response_model=UserModel, response_model_by_alias=False)
async def update_user_route(
    user_id: str,
    user_update: UserCreate,
    current_user: UserModel = Depends(get_current_user),
):
    """
    Update a user's information.
    """
    return await update_user(user_id, user_update)


# Route to list all users
@router.get("/users/", response_model=UserCollection, response_model_by_alias=False)
async def list_users_route(current_user: UserModel = Depends()):
    """
    List all users.
    """
    users = await list_users()
    # Wrap the list of users in a UserCollection
    return UserCollection(users=users)


# Route to create a new member
@router.post("/members/", response_model=MemberModel, response_model_by_alias=False)
async def create_member_route(member: MemberModelUpdate, inviting_user_id: str):
    """
    Create a new member.
    """
    return await create_member(member, inviting_user_id)


@router.post(
    "/invites/", response_model=InviteCollection, response_model_by_alias=False
)
async def create_invites_route(
    inviting_user_id: str, member_id: str, children: List[str]
):
    """
    Create invites for a member.
    """
    invites_to_create = [
        CreateInviteModel(
            child=child, guardian=inviting_user_id, member=member_id)
        for child in children
    ]
    return await create_invites(invites_to_create)


# Route to send an invite
@router.post("/users/{user_id}/invite")
async def send_invite_route(
    member: MemberModelUpdate, user_id: str, children: List[str]
):
    """
    Send an invite to a member.
    """
    return await send_invite(member, user_id, children)


# Route to verify a member's invite
@router.get("/verify_invite/{member_id}/{token}")
async def verify_invite_route(member_id: str, token: str):
    """
    Verify a member's invite using a token.
    """
    return await verify_member_invite(member_id, token)


# guardian RESTFUL ENDPOINTS:# Route to create a new guardian
@router.post(
    "/guardians/", response_model=GuardianModel, status_code=status.HTTP_201_CREATED
)
async def create_guardian_route(guardian: GuardianModel):
    """
    Create a new guardian.
    """
    return await create_guardian(guardian)


# Route to retrieve a guardian by ID
@router.get(
    "/guardians/{guardian_id}",
    response_model=GuardianModel,
    response_model_by_alias=False,
)
async def get_guardian_route(guardian_id: str, current_user: UserModel = Depends()):
    """
    Retrieve a guardian by their ID.
    """
    return await get_guardian_by_id(guardian_id)


# Route to update a guardian's information
@router.put(
    "/guardians/{guardian_id}",
    response_model=GuardianModel,
    response_model_by_alias=False,
)
async def update_guardian_route(
    guardian_id: str,
    guardian_data: GuardianModel,
    current_user: UserModel = Depends(get_current_user),
):
    """
    Update a guardian's information.
    """
    return await update_guardian(guardian_id, guardian_data.dict())


# Route to delete a guardian
@router.delete("/guardians/{guardian_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_guardian_route(
    guardian_id: str, current_user: UserModel = Depends(get_current_user)
):
    """
    Delete a guardian by their ID.
    """
    await delete_guardian(guardian_id)
    return None


# Route to get all guardians
@router.get(
    "/guardians/", response_model=List[GuardianModel], response_model_by_alias=False
)
async def get_all_guardians_route(current_user: UserModel = Depends(get_current_user)):
    """
    Retrieve all guardians.
    """
    return await get_all_guardians()


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


@router.put(
    "/members/{member_id}/accept",
    response_description="Accept member invitation",
    response_model=MemberModel,
    response_model_by_alias=False,
)
async def accept_member_invitation(member_id: str) -> dict:
    await db.get_collection("members").update_one(
        {"_id": ObjectId(member_id)}, {"$set": {"accepted_invitation": True}}
    )
    updated_member = await db.get_collection("members").find_one(
        {"_id": ObjectId(member_id)}
    )
    check_for_none(updated_member, "Member not found after update")
    invite_collection = db.get_collection("invites")
    invites_cursor = invite_collection.find({"member": member_id})
    invites = await invites_cursor.to_list(length=1000)
    for invite in invites:
        invite["accepted"] = True
        await invite_collection.update_one(
            {"_id": invite["_id"]}, {"$set": {"accepted": True}}
        )

    return MemberModel(**updated_member)


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
async def send_invite(member: MemberModelCreate, guardian_id: str, children: List[str]):
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "guardian collection not found")
    guardian = await guardian_collection.find_one({"_id": ObjectId(guardian_id)})
    if guardian is None:
        raise HTTPException(status_code=404, detail="Guardian not found")
    new_member = await create_member(member, guardian_id)
    await create_invites(guardian_id, str(new_member.id), children)
    print("we hit here 2")
    email = member.email
    token = create_safe_token({"email": email})
    link = f"http://{os.getenv('DOMAIN')}/member_signup/{new_member.id}/{token}/{guardian['name']}"
    html = f"""
    <h1>Welcome to the Sharents app</h1>
    <p> You have been invited to join by "{guardian['name']}"</p>
    <p> Click here <a href="{link}"> link<a/> to accept your invitation <p/>"""
    message = create_message(
        recipients=[email], subject="Accept your invitation", body=html
    )

    await mail.send_message(message)

    return {"message": "Account created!", "member": email}


@router.get("/verify_invite/{member_id}/{token}")
async def verify_member_invite(member_id: str, token: str):
    token_data = decode_url_safe_token(token)
    if token_data:
        print("token is valid!", token_data)
        return {"message": "token verified", "member": member_id}


@router.on_event("startup")
async def create_unique_index():
    guardian_collection = db.get_collection("guardians")

    await guardian_collection.delete_many({"username": None})
    await guardian_collection.update_many(
        {"username": ""}, {"$set": {"username": "user_" + str(ObjectId())}}
    )

    try:
        await guardian_collection.drop_index("username_1")
    except:
        pass

    await guardian_collection.create_index(
        [("username", ASCENDING)],
        unique=True,
        partialFilterExpression={"username": {"$type": "string"}},
    )


@router.get(
    "/members/{member_id}",
    response_description="Get a single guardian",
    response_model=MemberModel,
    response_model_by_alias=False,
)
async def get_member(
    member_id: str
):
    member = await db.get_collection("members").find_one(
        {"_id": ObjectId(member_id)})
    check_for_none(member, "guardian not found")
    return MemberModel(**member)
