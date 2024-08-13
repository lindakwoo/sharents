from typing import Optional
from pydantic import ConfigDict, BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]
class GuardianModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    email: EmailStr


class GuardianCollection(BaseModel):
    guardians: list[GuardianModel]