from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import List
from bson import ObjectId
from pymongo import ASCENDING
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
    Token,
    TokenData,
)
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

# OAuth2 configuration
SECRET_KEY = "your-secret-key"  # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_user(username: str):
    guardian_collection = db.get_collection("guardians")
    user = await guardian_collection.find_one({"username": username})
    if user:
        return GuardianModel(**user)


async def authenticate_user(username: str, password: str):
    user = await get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = await get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


@router.post(
    "/register", response_model=GuardianModel, status_code=status.HTTP_201_CREATED
)
async def register_user(guardian: GuardianModelCreate):
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "guardian collections not found")

    if not guardian.username or guardian.username.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username cannot be empty"
        )

    existing_user = await guardian_collection.find_one({"username": guardian.username})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    hashed_password = get_password_hash(guardian.password)
    guardian_dict = guardian.dict()
    guardian_dict["hashed_password"] = hashed_password
    del guardian_dict["password"]

    result = await guardian_collection.insert_one(guardian_dict)
    new_guardian = await guardian_collection.find_one({"_id": result.inserted_id})
    check_for_none(new_guardian, "Guardian not found after creation")
    return GuardianModel(**new_guardian)


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
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
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/verify")
async def verify_token(current_user: GuardianModel = Depends(get_current_user)):
    return {"X-User-ID": str(current_user.id)}


# ... (keep your existing imports)

# ... (keep your existing code)


@router.get(
    "/guardians/{guardian_id}",
    response_description="Get a single guardian",
    response_model=GuardianModel,
    response_model_by_alias=False,
)
async def get_guardian(
    guardian_id: str, current_user: GuardianModel = Depends(get_current_user)
):
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "guardian collection not found")

    guardian = await guardian_collection.find_one({"_id": ObjectId(guardian_id)})
    if guardian is None:
        raise HTTPException(status_code=404, detail="Guardian not found")

    return GuardianModel(**guardian)


@router.delete(
    "/guardians/{guardian_id}",
    response_description="Delete a guardian",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_guardian(
    guardian_id: str, current_user: GuardianModel = Depends(get_current_user)
):
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "guardian collection not found")

    delete_result = await guardian_collection.delete_one({"_id": ObjectId(guardian_id)})

    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Guardian not found")

    return None  # 204 No Content


@router.put(
    "/guardians/{guardian_id}",
    response_description="Update a guardian",
    response_model=GuardianModel,
    response_model_by_alias=False,
)
async def update_guardian(
    guardian_id: str,
    guardian_update: GuardianModelCreate,
    current_user: GuardianModel = Depends(get_current_user),
):
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "guardian collection not found")

    # Check if the guardian exists
    existing_guardian = await guardian_collection.find_one(
        {"_id": ObjectId(guardian_id)}
    )
    if existing_guardian is None:
        raise HTTPException(status_code=404, detail="Guardian not found")

    # Prepare update data
    update_data = guardian_update.model_dump(exclude_unset=True)

    # If password is being updated, hash it
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(
            update_data["password"])
        del update_data["password"]

    # Check if username is being updated and if it's already taken
    if (
        "username" in update_data
        and update_data["username"] != existing_guardian["username"]
    ):
        existing_user = await guardian_collection.find_one(
            {"username": update_data["username"]}
        )
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken",
            )

    # Perform the update
    result = await guardian_collection.update_one(
        {"_id": ObjectId(guardian_id)}, {"$set": update_data}
    )

    if result.modified_count == 0:
        raise HTTPException(
            status_code=404, detail="Guardian not found or no changes made"
        )

    # Fetch and return the updated guardian
    updated_guardian = await guardian_collection.find_one(
        {"_id": ObjectId(guardian_id)}
    )
    return GuardianModel(**updated_guardian)


@router.get(
    "/guardians/",
    response_description="List all guardians",
    response_model=GuardianCollection,
    response_model_by_alias=False,
)
async def list_guardians(current_user: GuardianModel = Depends(get_current_user)):
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "guardian collections not found")
    guardians = await guardian_collection.find().to_list(1000)
    return GuardianCollection(guardians=guardians)


# @router.post(
#     "/guardians/",
#     response_description="Create a guardian",
#     response_model=GuardianModel,
#     response_model_by_alias=False,
#     status_code=status.HTTP_201_CREATED,
# )
# async def create_guardian(guardian: GuardianModelCreate):
#     guardian_collection = db.get_collection("guardians")
#     check_for_none(guardian_collection, "guardian collections not found")

#     if not guardian.username or guardian.username.strip() == "":
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST, detail="Username cannot be empty"
#         )

#     existing_user = await guardian_collection.find_one({"username": guardian.username})
#     if existing_user:
#         raise HTTPException(
#             status_code=status.HTTP_400_BAD_REQUEST,
#             detail="Username already registered",
#         )

#     hashed_password = get_password_hash(guardian.password)
#     guardian_dict = guardian.dict()
#     guardian_dict["hashed_password"] = hashed_password
#     del guardian_dict["password"]

#     result = await guardian_collection.insert_one(guardian_dict)
#     new_guardian = await guardian_collection.find_one({"_id": result.inserted_id})
#     check_for_none(new_guardian, "Guardian not found after creation")
#     return GuardianModel(**new_guardian)


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
    link = f"http://{os.getenv('DOMAIN')}/member_signup/{new_member.id}/{token}"
    html = f"""
    <h1>Welcome to the app</h1>
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
