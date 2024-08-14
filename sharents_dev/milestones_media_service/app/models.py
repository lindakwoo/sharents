from pydantic import BaseModel
from typing import Optional


class Milestone(BaseModel):
    date: str
    name: str
    category: str  # foreign key from Category “milestones”
    description: str
    child: str  # foreign key Child “milestones”


class Media(BaseModel):
    date: str
    category: str  # foreign key from Category “media”
    url: str
    child: str  # foreign key Child “media”
    description: str
    type: str  # photo or video


class Comment(BaseModel):
    media: str
    milestone: str
    text: str


class Category(BaseModel):
    name: str  # can be one of the following: food, growth, health, speech, physical,cognitive,other
