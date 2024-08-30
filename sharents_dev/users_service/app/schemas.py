from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

# Annotated type for MongoDB ObjectId
PyObjectId = Annotated[str, BeforeValidator(str)]


class LoginModel(BaseModel):
    username: str
    password: str


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


class UserCreate(UserBase):
    """Model for creating a new user, including password."""

    password: str = Field(...)  # The plaintext password for the user


class UserModel(UserBase):
    """Model representing a user stored in the database."""

    id: Optional[PyObjectId] = Field(alias="_id", default=None)  # MongoDB ObjectId
    hashed_password: str = Field(...)  # The hashed password for the user
    role: str = Field(...)  # The role of the user (e.g., 'guardian' or 'member')


class UserCollection(BaseModel):
    """Model for a collection of users."""

    users: List[UserModel]  # List of user models


class EmailModel(BaseModel):
    """Model for email addresses."""

    address: str  # The email address


class MemberModelUpdate(BaseModel):
    """Model for updating member information."""

    name: Optional[str] = Field(default=None)  # Optional new name
    email: Optional[EmailStr] = Field(default=None)  # Optional new email
    accepted_invitation: Optional[bool] = Field(
        default=None
    )  # Invitation acceptance status
    username: Optional[str] = Field(default=None)  # Optional new username
    password: Optional[str] = Field(default=None)  # Optional new plaintext password


class MemberModel(UserModel):
    """Model representing a member stored in the database."""

    invited_by: str = Field(...)  # The ID of the guardian who invited the member
    accepted_invitation: bool = Field(
        ...
    )  # Indicates if the member accepted the invitation


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


""""
Explanation of the Code:
Token and TokenData: Models for handling JWT tokens, including the access token and associated username.
UserBase: A base model containing common fields for user information such as name, email, and username.
UserCreate: Extends UserBase to include a password field for user registration.
UserModel: Represents the user as stored in the database, including an ID, hashed password, and role.
UserCollection: A model for a collection of users, useful for returning multiple users in a response.
EmailModel: A simple model for handling email addresses.
MemberModelUpdate: A model for updating existing members with optional fields.
MemberModel: Extends UserModel to include member-specific fields such as the inviter's ID and invitation acceptance status.
InviteModel: Represents an invitation, including the IDs of the child, member, and guardian, along with acceptance status.
InviteCollection: A model for a collection of invitations."""
