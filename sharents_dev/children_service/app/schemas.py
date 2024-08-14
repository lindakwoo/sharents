from pydantic import BaseModel, Field


class ChildCreateSchema(BaseModel):
    name: str = Field(...)
    birthdate: str = Field(...)
    profile_picture: str = Field(...)
    guardian: str = Field(...)


class ChildResponseSchema(BaseModel):
    id: str = Field(...)
    name: str = Field(...)
    birthdate: str = Field(...)
    profile_picture: str = Field(...)
    guardian: str = Field(...)
