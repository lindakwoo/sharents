from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]

class GuardianModelCreate(BaseModel):
    name: str = Field(...)
    email: EmailStr = Field(...)

class GuardianModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str = Field(...)
    email: EmailStr = Field(...)

class GuardianCollection(BaseModel):
    guardians: List[GuardianModel]