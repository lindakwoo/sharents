from pydantic import BaseModel, Field


class WishlistCreateSchema(BaseModel):
    child: str = Field(...)
    event: str = Field(...)


class WishlistResponseSchema(BaseModel):
    id: str = Field(...)
    child: str = Field(...)
    event: str = Field(...)

    class Config:
        orm_mode = True


class WishListItemCreateSchema(BaseModel):
    description: str = Field(...)
    is_purchased: bool = Field(...)
    wishList: str = Field(...)
    url: str = Field(...)
    price: float = Field(...)


class WishListItemResponseSchema(BaseModel):
    id: str = Field(...)
    description: str = Field(...)
    is_purchased: bool = Field(...)
    wishList: str = Field(...)
    url: str = Field(...)
    price: float = Field(...)

    class Config:
        orm_mode = True


class EventCreateSchema(BaseModel):
    child: str = Field(...)
    datetime: str = Field(...)
    description: str = Field(...)


class EventResponseSchema(BaseModel):
    id: str = Field(...)
    child: str = Field(...)
    datetime: str = Field(...)
    description: str = Field(...)

    class Config:
        orm_mode = True
