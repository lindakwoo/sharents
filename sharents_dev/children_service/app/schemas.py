from pydantic import BaseModel


class ChildCreateSchema(BaseModel):
    name: str
    birthdate: str
    profilePicture: str
    guardian: str
    invites: str
    milestones: list
    media: list
    events: list
    wishlists: list

class ChildResponseSchema(BaseModel):
    id: str
    name: str
    birthdate: str
    profilePicture: str
    guardian: str
    invites: str
    milestones: list
    media: list
    events: list
    wishlists: list


# class child(BaseModel):
#     name: str
#     birthdate: str
#     profilePicture: str
#     guardian: str #foreign key from Guardian “children”
#     invites: str #foreign key from Invite “children”
#     milestones: list #foreign key from Milestone “children”
#     media: list #foreign key from Media “children”
#     events: list #foreign key from Event “children”
#     wishlists: list #foreign key from Wishlist “children”
#     class Config:
#         orm_mode = True
