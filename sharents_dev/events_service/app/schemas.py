from pydantic import BaseModel, Field
from typing import List, Optional
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated

PyObjectId = Annotated[str, BeforeValidator(str)]


class BaseModelWithConfig(BaseModel):
    class Config:
        from_attributes = True
        populate_by_name = True


class WishlistModelCreate(BaseModelWithConfig):
    name: str = Field(...)


class WishlistModelUpdate(BaseModelWithConfig):
    name: Optional[str] = Field(default=None)


class WishlistModel(BaseModelWithConfig):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    event: str = Field(...)
    name: str = Field(...)


class WishlistCollection(BaseModelWithConfig):
    wishlists: List[WishlistModel]


class WishlistItemModelCreate(BaseModelWithConfig):
    description: str = Field(...)
    is_purchased: bool = Field(...)
    wishList: str = Field(...)
    url: str = Field(...)
    price: float = Field(...)


class WishlistItemModelUpdate(BaseModelWithConfig):
    description: Optional[str] = Field(default=None)
    is_purchased: Optional[bool] = Field(default=None)
    wishList: Optional[str] = Field(default=None)
    url: Optional[str] = Field(default=None)
    price: Optional[float] = Field(default=None)


class WishlistItemModel(BaseModelWithConfig):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    description: str = Field(...)
    is_purchased: bool = Field(...)
    wishList: str = Field(...)
    url: str = Field(...)
    price: float = Field(...)


class WishlistItemCollection(BaseModelWithConfig):
    wishlistItems: List[WishlistItemModel]


class EventModelCreate(BaseModelWithConfig):
    datetime: str = Field(...)
    description: str = Field(...)
    child: str = Field(...)
    title: str = Field(...)


class EventModelUpdate(BaseModelWithConfig):
    datetime: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    child: Optional[str] = Field(default=None)
    title: Optional[str] = Field(default=None)


class EventModel(BaseModelWithConfig):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    child: str = Field(...)
    datetime: str = Field(...)
    description: str = Field(...)
    title: str = Field(...)


class EventCollection(BaseModelWithConfig):
    events: List[EventModel]
