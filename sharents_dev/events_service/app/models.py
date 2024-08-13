from pydantic import BaseModel
from typing import Optional

class Event(BaseModel):
    child_id: str #child_id foreign key from Child “events”
    date: str
    time: str
    description: str

    class Config:
        orm_mode = True

class Wishlist(BaseModel):
    child_id: str #foreign key from Child “wishlist”
    event_id: str #foreign key from Event “wishlist”
    properties:  list #items  # from WishlistItem

class WishListItem(BaseModel):
    description: str
    isPusrcahsed: bool
    wishList_id: str #foreign key from WishlistItem
    url: str
    price: float
