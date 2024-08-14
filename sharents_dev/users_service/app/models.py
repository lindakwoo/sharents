from bson import ObjectId
from pydantic import BaseModel, EmailStr
from typing import Optional


# class User(BaseModel):
#     name: str
#     email: EmailStr

#     class Config:
#         orm_mode = True


class Guardian(BaseModel):
    id: str
    name: str
    email: str


class Member(BaseModel):
    name: str
    email: str
    invite_code: str
    invited_by: Optional[str]  # ID of the Guardian
