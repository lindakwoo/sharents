from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated
import datetime
from enum import Enum

PyObjectId = Annotated[str, BeforeValidator(str)]


class CategoryEnum(str, Enum):
    growth = 'growth'
    food = 'food'
    health = 'health'
    speeach = 'speech'
    physical = 'physical'
    cognitive = 'cognitive'
    other = 'other'


class MediaModelUpdate(BaseModel):
    description: Optional[str] = Field(default=None)
    category: Optional[CategoryEnum] = Field(default=None)
    date: Optional[str] = Field(default=None)
    type: Optional[str] = Field(default=None)
    url: Optional[str] = Field(default=None)


class MediaModelCreate(BaseModel):
    description: str = Field(...)
    category: CategoryEnum = Field(...)
    date: str = Field(...)
    type: str = Field(...)
    url: str = Field(...)


class MediaModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    description: str = Field(...)
    category: Optional[CategoryEnum] = Field(default=None)
    child: str = Field(...)
    date: str = Field(...)
    type: str = Field(...)
    url: str = Field(...)
    created_at: datetime = Field(...)

    model_config = ConfigDict(arbitrary_types_allowed=True)


class MediaCollection(BaseModel):
    media: List[MediaModel]


class ChildModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(...)
    birthdate: str = Field(...)
    profile_picture: str = Field(...)
    guardian: str = Field(...)


class ChildrenCollection(BaseModel):
    children: List[ChildModel]


class MilestoneModelUpdate(BaseModel):
    name: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    category: Optional[CategoryEnum] = Field(default=None)
    date: Optional[str] = Field(default=None)


class MilestoneModelCreate(BaseModel):
    name: str = Field(...)
    description: str = Field(...)
    category: CategoryEnum = Field(...)
    date: str = Field(...)


class MilestoneModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(...)
    description: str = Field(...)
    category: CategoryEnum = Field(...)
    child: str = Field(...)
    date: str = Field(...)
    created_at: datetime = Field(...)

    model_config = ConfigDict(arbitrary_types_allowed=True)


class MilestoneCollection(BaseModel):
    milestones: List[MilestoneModel]


class CommentModelCreate(BaseModel):
    text: str = Field(...)
    member: Optional[str] = Field(default=None)
    guardian: Optional[str] = Field(default=None)
    creator_name: Optional[str] = Field(default=None)


class CommentModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    media: Optional[str] = Field(default=None)
    milestone: Optional[str] = Field(default=None)
    text: str = Field(...)
    member: Optional[str] = Field(default=None)
    guardian: Optional[str] = Field(default=None)
    creator_name: Optional[str] = Field(default=None)


class CommentCollection(BaseModel):
    comments: List[CommentModel]
