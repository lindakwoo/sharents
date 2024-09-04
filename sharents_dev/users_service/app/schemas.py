from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

# Annotated type for MongoDB ObjectId
PyObjectId = Annotated[str, BeforeValidator(str)]


class MemberModelUpdate(BaseModel):
    """Model for updating member information."""

    name: Optional[str] = Field(default=None)  # Optional new name
    email: Optional[EmailStr] = Field(default=None)  # Optional new email
    accepted_invitation: Optional[bool] = Field(
        default=None
    )  # Invitation acceptance status
    username: Optional[str] = Field(default=None)  # Optional new username
    # Optional new plaintext password
    password: Optional[str] = Field(default=None)


class MemberModel(BaseModel):
    """Model representing a member stored in the database."""

    id: Optional[PyObjectId] = Field(
        alias="_id", default=None)  # MongoDB ObjectId
    name: Optional[str] = Field(default=None)  # Optional member name
    email: Optional[EmailStr] = Field(default=None)  # Optional member email


class UserBase(BaseModel):
    """Base model for user-related information."""

    name: str = Field(...)  # The name of the user
    email: EmailStr = Field(...)  # The email address of the user
    username: str = Field(...)  # The username of the user


class UserModel(UserBase):
    """Model representing a user stored in the database."""

    id: Optional[PyObjectId] = Field(
        alias="_id", default=None)  # MongoDB ObjectId
    hashed_password: str = Field(...)  # The hashed password for the user
    # The role of the user (e.g., 'guardian' or 'member')
    role: str = Field(...)
    member: Optional[MemberModel] = None  # Optional member data for the user
    guardian_id: Optional[PyObjectId] = Field(
        alias="guardian_id", default=None
    )  # ID of the guardian
    member_id: Optional[PyObjectId] = Field(
        alias="member_id", default=None
    )  # ID of the member


class EmailModel(BaseModel):
    """Model for email addresses."""

    address: str  # The email address


class InviteModel(BaseModel):
    """Model for an invitation to a member."""

    id: Optional[PyObjectId] = Field(
        alias="_id", default=None)  # MongoDB ObjectId
    child: str = Field(...)  # The ID of the child being invited
    member: str = Field(...)  # The ID of the member being invited
    guardian: str = Field(...)  # The ID of the guardian sending the invite
    # Indicates if the invitation has been accepted
    accepted: bool = Field(...)


class InviteCollection(BaseModel):
    """Model for a collection of invitations."""

    invites: List[InviteModel]  # List of invite models


class LoginModel(BaseModel):
    """Model for login information."""

    username: str
    password: str


class GuardianModel(UserModel):
    """Model representing a guardian stored in the database."""

    id: Optional[PyObjectId] = Field(
        alias="_id", default=None)  # MongoDB ObjectId

    # Guardian-specific fields can be added here if needed


class GuardianModelUpdate(BaseModel):
    """Model for updating guardian information."""

    name: Optional[str] = Field(default=None)  # Optional new name
    email: Optional[EmailStr] = Field(default=None)  # Optional new email
    username: Optional[str] = Field(default=None)  # Optional new username
    # Optional new plaintext password
    password: Optional[str] = Field(default=None)


class Token(BaseModel):
    """Model for the access token returned after successful authentication."""

    access_token: str  # The JWT access token
    token_type: str  # The type of token, typically 'bearer'
    user: UserModel  # The user information associated with the token


class TokenData(BaseModel):
    """Model for the data contained in the token."""

    username: Optional[str] = None  # The username associated with the token


class UserCollection(BaseModel):
    """Model for a collection of users."""

    users: List[UserModel]  # List of user models


class UserCreate(UserBase):
    """Model for creating a new user, including password."""

    role: Optional[str] = None
    password: str = Field(...)  # The plaintext password for the user


class CreateInviteModel(BaseModel):
    """Model for creating an invite."""

    child: str
    guardian: str
    member: str


class MemberUserCreate(BaseModel):
    """Model for creating a member user without requiring username and password initially."""

    name: str = Field(...)  # The name of the member
    email: EmailStr = Field(...)  # The email address of the member
    invited_by: str = Field(...)  # The ID of the guardian inviting the member


class MemberModelCreate(BaseModel):
    name: str = Field(...)
    email: EmailStr = Field(...)
