from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from bson import ObjectId
from .schemas import (
    EventCollection,
    EventModel,
    EventModelCreate,
    EventModelUpdate,
    WishlistCollection,
    WishlistModelUpdate,
    WishlistModel,
    WishlistModelCreate,
    WishlistItemModel,
    WishlistItemModelCreate,
    WishlistItemCollection,
)
from .utils import (
    check_for_none,
    check_list_not_empty,
    check_update_result,
    check_delete_result,
)
from .database import db

router = APIRouter()

# ... (existing event endpoints)


# Get all wishlists for an event
@router.get(
    "/events/{event_id}/wishlists/",
    response_description="Get all wishlists for an event",
    response_model=WishlistCollection,
    response_model_by_alias=False,
)
async def get_wishlists(event_id: str):
    wishlist_collection = db.get_collection("wishlists")
    check_for_none(wishlist_collection, "Wishlist collections not found")
    wishlists_cursor = wishlist_collection.find({"event": event_id})
    wishlists = await wishlists_cursor.to_list(length=1000)
    check_list_not_empty(wishlists, "No wishlists found for this event")
    return WishlistCollection(wishlists=wishlists)


# Create a wishlist for an event
@router.post(
    "/events/{event_id}/wishlists/",
    response_description="Create a new wishlist",
    response_model=WishlistModel,
    response_model_by_alias=False,
)
async def create_wishlist(wishlist: WishlistModelCreate, event_id: str):
    wishlist_collection = db.get_collection("wishlists")
    check_for_none(wishlist_collection, "Wishlist collections not found")
    wishlist_data = wishlist.dict()
    wishlist_data["event"] = event_id
    result = await wishlist_collection.insert_one(wishlist_data)
    new_wishlist = await wishlist_collection.find_one({"_id": result.inserted_id})
    check_for_none(new_wishlist, "Wishlist not found after creation")
    return WishlistModel(**new_wishlist)


# Get one wishlist
@router.get(
    "/wishlists/{wishlist_id}",
    response_description="Get a wishlist",
    response_model=WishlistModel,
    response_model_by_alias=False,
)
async def get_wishlist(wishlist_id: str):
    wishlist = await db.get_collection("wishlists").find_one(
        {"_id": ObjectId(wishlist_id)}
    )
    check_for_none(wishlist, "Wishlist not found")
    return WishlistModel(**wishlist)


# Update a wishlist
@router.put(
    "/wishlists/{wishlist_id}",
    response_description="Update a wishlist",
    response_model=WishlistModel,
    response_model_by_alias=False,
)
async def update_wishlist(wishlist_id: str, wishlist_update: WishlistModelUpdate):
    update_result = await db.get_collection("wishlists").update_one(
        {"_id": ObjectId(wishlist_id)},
        {"$set": wishlist_update.dict(exclude_unset=True)},
    )
    check_update_result(update_result, "Updated wishlist not found")
    updated_wishlist = await db.get_collection("wishlists").find_one(
        {"_id": ObjectId(wishlist_id)}
    )
    check_for_none(updated_wishlist, "Wishlist not found after update")
    return WishlistModel(**updated_wishlist)


# Delete a wishlist
@router.delete(
    "/wishlists/{wishlist_id}",
    response_description="Delete a wishlist",
)
async def delete_wishlist(wishlist_id: str):
    delete_result = await db.get_collection("wishlists").delete_one(
        {"_id": ObjectId(wishlist_id)}
    )
    check_delete_result(delete_result, "No deleted wishlist found")
    return {"message": "Wishlist successfully deleted"}
