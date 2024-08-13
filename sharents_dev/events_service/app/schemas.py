from pydantic import BaseModel

class WishlistCreateSchema(BaseModel):
  child: str
  event: str
  properties: list

class WishlistResponseSchema(BaseModel):
  id: str
  child: str
  event: str
  properties: list

  class Config:
    orm_mode = True

class WishListItemCreateSchema(BaseModel):
  description: str
  isPusrcahsed: bool
  wishList: str
  url: str
  price: float

class WishListItemResponseSchema(BaseModel):
  id: str
  description: str
  isPusrcahsed: bool
  wishList: str
  url: str
  price: float

  class Config:
    orm_mode = True

class EventCreateSchema(BaseModel):
  child: str
  date: str
  time: str
  description: str

class EventResponseSchema(BaseModel):
  id: str
  child: str
  date: str
  time: str
  description: str

  class Config:
    orm_mode = True