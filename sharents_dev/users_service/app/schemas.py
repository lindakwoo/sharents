from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class GuardianModelCreate(BaseModel):
    name: str = Field(...)
    email: EmailStr = Field(...)
    username: str = Field(...)
    password: str = Field(...)


class GuardianModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(...)
    email: EmailStr = Field(...)
    username: str = Field(...)
    hashed_password: str = Field(...)


class GuardianCollection(BaseModel):
    guardians: List[GuardianModel]


class EmailModel(BaseModel):
    address: str


class MemberModelCreate(BaseModel):
    name: str = Field(...)
    email: EmailStr = Field(...)


class MemberModelUpdate(BaseModel):
    name: Optional[str] = Field(default=None)
    email: Optional[EmailStr] = Field(default=None)
    accepted_invitation: Optional[bool] = Field(default=None)
    username: Optional[str] = Field(default=None)
    password: Optional[str] = Field(default=None)
    hashed_password: Optional[str] = Field(default=None)


class MemberModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(...)
    email: EmailStr = Field(...)
    username: str = Field(...)
    hashed_password: str = Field(...)
    invited_by: str = Field(...)
    accepted_invitation: bool = Field(...)


class MemberCollection(BaseModel):
    members: List[GuardianModel]


class InviteModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    child: str = Field(...)
    member: str = Field(...)
    guardian: str = Field(...)
    accepted: bool = Field(...)


class InviteCollection(BaseModel):
    invites: List[InviteModel]
