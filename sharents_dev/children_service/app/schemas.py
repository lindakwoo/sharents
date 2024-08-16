from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]


class ChildModelCreate(BaseModel):
    name: str = Field(...)
    birthdate: str = Field(...)
    profile_picture: str = Field(...)


class ChildModelUpdate(BaseModel):
    name: Optional[str] = Field(default=None)
    birthdate: Optional[str] = Field(default=None)
    profile_picture: Optional[str] = Field(default=None)


class ChildModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(...)
    birthdate: str = Field(...)
    profile_picture: str = Field(...)
    guardian: str = Field(...)


class ChildrenCollection(BaseModel):
    children: List[ChildModel]
