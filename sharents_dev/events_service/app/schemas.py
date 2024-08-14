from pydantic import BaseModel, Field
from typing import List, Optional
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]


class WishlistModelCreate(BaseModel):
    child: str = Field(...)
    event: str = Field(...)


class WishlistModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    child: str = Field(...)
    event: str = Field(...)

    class Config:
        orm_mode = True


class WishlistCollection(BaseModel):
    wishlists: List[WishlistModel]


class WishListItemModelCreate(BaseModel):
    description: str = Field(...)
    is_purchased: bool = Field(...)
    wishList: str = Field(...)
    url: str = Field(...)
    price: float = Field(...)


class WishListItemModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    description: str = Field(...)
    is_purchased: bool = Field(...)
    wishList: str = Field(...)
    url: str = Field(...)
    price: float = Field(...)

    class Config:
        orm_mode = True


class WishlistItemCollection(BaseModel):
    wishlistItems: List[WishListItemModel]


class EventModelCreate(BaseModel):
    child: str = Field(...)
    datetime: str = Field(...)
    description: str = Field(...)


class EventModel(BaseModel):
    id: str = Field(...)
    child: str = Field(...)
    datetime: str = Field(...)
    description: str = Field(...)

    class Config:
        orm_mode = True


class EventCollection(BaseModel):
    events: List[EventModel]
