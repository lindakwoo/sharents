from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]


class LoginModel(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class BaseUserModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(...)
    email: EmailStr = Field(...)
    username: str = Field(...)


class User(BaseUserModel):
    role: str = Field(...)
    hashed_password: str = Field(...)


class GuardianModel(User):
    pass


class MemberModel(User):
    invited_by: str = Field(...)
    accepted_invitation: bool = Field(...)


class InviteModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    child: str = Field(...)
    member: str = Field(...)
    guardian: str = Field(...)
    accepted: bool = Field(...)


class UserCreate(BaseModel):
    name: str = Field(...)
    email: EmailStr = Field(...)
    username: str = Field(...)
    password: str = Field(...)
    role: str = Field(...)


class CreateMemberModel(UserCreate):
    invited_by: str


class UserCollection(BaseModel):
    users: List[User]


class InviteCollection(BaseModel):
    invites: List[InviteModel]


class EmailModel(BaseModel):
    address: str


class MemberModelUpdate(BaseModel):
    name: Optional[str] = Field(default=None)
    email: Optional[EmailStr] = Field(default=None)
    accepted_invitation: Optional[bool] = Field(default=None)
    username: Optional[str] = Field(default=None)
    password: Optional[str] = Field(default=None)


class CreateInviteModel(BaseModel):
    child: str
    guardian: str
    member: str


class Role(BaseModel):
    value: str
    type_: str = Field(alias="type")

    @classmethod
    def __get_validators__(cls):
        yield cls.validate_role

    @classmethod
    def validate_role(cls, v):
        if not isinstance(v, str) or v.lower() not in ["guardian", "member"]:
            raise ValueError("Invalid role value")
        return cls(value=v.lower(), type_="string")
