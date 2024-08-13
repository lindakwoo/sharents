from pydantic import BaseModel

class MediaCreateSchema(BaseModel):
    date: str
    name: str
    category_id: str
    description: str
    child_id: str
    comments: list

class MediaResponseSchema(BaseModel):
    id: str
    date: str
    name: str
    category_id: str
    description: str
    child_id: str
    comments: list

    class Config:
        orm_mode = True

class MilestoneCreateSchema(BaseModel):
    date: str
    name: str
    category_id: str
    description: str
    child_id: str
    comments: list

class MilestoneResponseSchema(BaseModel):
    id: str
    date: str
    name: str
    category_id: str
    description: str
    child_id: str
    comments: list

    class Config:
        orm_mode = True

class CommentCreateSchema(BaseModel):
    media_id: str
    milestone_id: str
    text: str

class CommentResponseSchema(BaseModel):
    id: str
    media_id: str
    milestone_id: str
    text: str

    class Config:
        orm_mode = True