from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class MediaModelUpdate(BaseModel):
    description: Optional[str] = Field(default=None)
    category: Optional[str] = Field(default=None)
    date: Optional[str] = Field(default=None)
    type: Optional[str] = Field(default=None)
    url: Optional[str] = Field(default=None)

class MediaModelCreate(BaseModel):
    description: str = Field(...)
    category: Optional[str] = Field(default=None)
    date: str = Field(...)
    type: str = Field(...)
    url: str = Field(...)


class MediaModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    description: str = Field(...)
    category: Optional[str] = Field(default=None)
    child: str = Field(...)
    date: str = Field(...)
    type: str = Field(...)
    url: str = Field(...)


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
    category: Optional[str] = Field(default=None)
    date: Optional[str] = Field(default=None)

class MilestoneModelCreate(BaseModel):
    name: str = Field(...)
    description: str = Field(...)
    category: str = Field(...)
    date: str = Field(...)


class MilestoneModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(...)
    description: str = Field(...)
    category: str = Field(...)
    child: str = Field(...)
    date: str = Field(...)


class MilestoneCollection(BaseModel):
    milestones: List[MilestoneModel]


class CommentModelCreate(BaseModel):
    text: str = Field(...)


class CommentModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    media: Optional[str] = Field(default=None)
    milestone: Optional[str] = Field(default=None)
    text: str = Field(...)


class CommentCollection(BaseModel):
    comments: List[CommentModel]


class CategoryModel(BaseModel):
    name: str = Field(...)


class CategoryCollection(BaseModel):
    categories: List[CategoryModel]
