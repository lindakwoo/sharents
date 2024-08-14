from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from bson import ObjectId
from .models import Event, Wishlist, WishListItem
from .schemas import EventCreateSchema, EventResponseSchema, WishlistCreateSchema, WishlistResponseSchema, WishListItemCreateSchema, WishListItemResponseSchema
from .database import db
from .utils import check_for_none, check_list_not_empty


router = APIRouter()


@router.get(
    "/children/{child_id}/events/",
    response_description="Get all",
    response_model=GuardianCollection,
    response_model_by_alias=False,
)
async def list_guardians():
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "guardian collections not found")
    guardians = await guardian_collection.find().to_list(1000)
    check_list_not_empty(guardians, "no guardians found")
    return GuardianCollection(guardians=guardians)
