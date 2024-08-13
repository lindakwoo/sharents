from pydantic import BaseModel
from typing import Optional

class Milestone(BaseModel):
    date: str
    name: str
    category: str #foreign key from Category “milestones”
    description: str
    child_id: str #foreign key Child “milestones”
    properties: list #comments from Comment

class Media(BaseModel):
    date: str
    category: str #foreign key from Category “media”
    url: str
    child_id: str #foreign key Child “media”
    description: str
    type: str #photo or video
    properties: list #comments from Comment

class Comment(BaseModel):
    media_id: str
    milestone_id: str
    text: str

class Category(BaseModel):
    name: str #can be one of the following: food, growth, health, speech, physical,cognitive,other
