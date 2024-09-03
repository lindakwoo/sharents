from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

# Annotated type for MongoDB ObjectId
PyObjectId = Annotated[str, BeforeValidator(str)]


class EmailModel(BaseModel):
    """Model for email addresses."""

    address: str  # The email address


class InviteModel(BaseModel):
    """Model for an invitation to a member."""

    id: Optional[PyObjectId] = Field(alias="_id", default=None)  # MongoDB ObjectId
    child: str = Field(...)  # The ID of the child being invited
    member: str = Field(...)  # The ID of the member being invited
    guardian: str = Field(...)  # The ID of the guardian sending the invite
    accepted: bool = Field(...)  # Indicates if the invitation has been accepted


class InviteCollection(BaseModel):
    """Model for a collection of invitations."""

    invites: List[InviteModel]  # List of invite models


class LoginModel(BaseModel):
    username: str
    password: str


class MemberModel(UserModel):
    """Model representing a member stored in the database."""

    invited_by: str = Field(...)  # The ID of the guardian who invited the member
    accepted_invitation: bool = Field(
        ...
    )  # Indicates if the member accepted the invitation


class MemberModelUpdate(BaseModel):
    """Model for updating member information."""

    name: Optional[str] = Field(default=None)  # Optional new name
    email: Optional[EmailStr] = Field(default=None)  # Optional new email
    accepted_invitation: Optional[bool] = Field(
        default=None
    )  # Invitation acceptance status
    username: Optional[str] = Field(default=None)  # Optional new username
    password: Optional[str] = Field(default=None)  # Optional new plaintext password


class Token(BaseModel):
    """Model for the access token returned after successful authentication."""

    access_token: str  # The JWT access token
    token_type: str  # The type of token, typically 'bearer'


class TokenData(BaseModel):
    """Model for the data contained in the token."""

    username: Optional[str] = None  # The username associated with the token


class UserBase(BaseModel):
    """Base model for user-related information."""

    name: str = Field(...)  # The name of the user
    email: EmailStr = Field(...)  # The email address of the user
    username: str = Field(...)  # The username of the user


class UserCollection(BaseModel):
    """Model for a collection of users."""

    users: List[UserModel]  # List of user models


class UserCreate(UserBase):
    """Model for creating a new user, including password."""

    password: str = Field(...)  # The plaintext password for the user


class UserModel(UserBase):
    """Model representing a user stored in the database."""

    id: Optional[PyObjectId] = Field(alias="_id", default=None)  # MongoDB ObjectId
    hashed_password: str = Field(...)  # The hashed password for the user
    role: str = Field(...)  # The role of the user (e.g., 'guardian' or 'member')


class CreateInviteModel(BaseModel):
    child: str
    guardian: str
    member: str
