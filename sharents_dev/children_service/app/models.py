from pydantic import BaseModel
from typing import Optional


class Child(BaseModel):
    name: str
    birthdate: str
    profile_picture: str
    guardian_id: str  # foreign key from Guardian “children”

    class Config:
        orm_mode = True
