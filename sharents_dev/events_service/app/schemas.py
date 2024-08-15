from pydantic import BaseModel, Field
from typing import List, Optional
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]


class WishlistModelCreate(BaseModel):
    name: str = Field(...)


class WishlistModelUpdate(BaseModel):
    name: Optional[str] = Field(default=None)


class WishlistModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    event: str = Field(...)
    name: str = Field(...)


class WishlistCollection(BaseModel):
    wishlists: List[WishlistModel]


class WishlistItemModelCreate(BaseModel):
    description: str = Field(...)
    url: str = Field(...)
    price: float = Field(...)


class WishlistItemModelUpdate(BaseModel):
    description: Optional[str] = Field(default=None)
    is_purchased: Optional[bool] = Field(default=None)
    url: Optional[str] = Field(default=None)
    price: Optional[float] = Field(default=None)


class WishlistItemModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    description: str = Field(...)
    is_purchased: bool = Field(...)
    wishlist: str = Field(...)
    url: str = Field(...)
    price: float = Field(...)


class WishlistItemCollection(BaseModel):
    wishlistItems: List[WishlistItemModel]


class EventModelCreate(BaseModel):
    datetime: str = Field(...)
    description: str = Field(...)
    child: str = Field(...)
    title: str = Field(...)


class EventModelUpdate(BaseModel):
    datetime: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    child: Optional[str] = Field(default=None)
    title: Optional[str] = Field(default=None)


class EventModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    child: str = Field(...)
    datetime: str = Field(...)
    description: str = Field(...)
    title: str = Field(...)


class EventCollection(BaseModel):
    events: List[EventModel]
