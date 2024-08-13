from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class MediaModelCreate(BaseModel):
    name: str = Field(...)
    description: str = Field(...)
    category: Optional[str] = Field(default=None)
    child: str = Field(...)
    date: str = Field(...)

class MediaModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(...)
    description: str = Field(...)
    category: Optional[str] = Field(default=None)
    child: str = Field(...)
    date: str = Field(...)

class MediaCollection(BaseModel):
    media: List[MediaModel]


class MilestoneModelCreate(BaseModel):
    name: str = Field(...)
    description: str = Field(...)
    category: str = Field(...)
    child: str = Field(...)
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
    media: Optional[str] = Field( default=None)
    milestone: Optional[str] = Field( default=None)
    text: str = Field(...)

class CommentModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    media: Optional[str] = Field( default=None)
    milestone: Optional[str] = Field( default=None)
    text: str = Field(...)

class CommentCollection(BaseModel):
    comments: List[CommentModel]