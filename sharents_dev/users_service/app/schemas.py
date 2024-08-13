from pydantic import BaseModel, EmailStr

class UserCreateSchema(BaseModel):
    name: str
    email: EmailStr
    relationship: str

class UserResponseSchema(UserCreateSchema):
    id: str
    name: str
    email: EmailStr
    relationship: str

    class Config:
        orm_mode = True