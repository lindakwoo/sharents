# from pydantic import BaseModel, EmailStr
# from typing import Optional

# class User(BaseModel):
#     name: str
#     email: EmailStr
#     relationship: str

#     class Config:
#         orm_mode = True

# class Guardian(BaseModel):
#     name: str
#     email: str
#     relationship: str

# class Member(BaseModel):
#     name: str
#     email: str
#     relationship: str
#     invite_code: str
#     invited_by: Optional[str]  # ID of the Guardian