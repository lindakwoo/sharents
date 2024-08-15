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
    WishlistItemModelUpdate,
    WishlistItemCollection,
)
from ...utils import (
    check_for_none,
    check_list_not_empty,
    check_update_result,
    check_delete_result,
)
from .database import db
router = APIRouter()
# Event CRUD operations


@router.get(
    "/children/{child_id}/events/",
    response_description="List all events",
    response_model=EventCollection,
    response_model_by_alias=False,
)
async def list_events(child_id: str):
    events = await db.get_collection("events").find({'child': child_id}).to_list(1000)
    check_list_not_empty(events, "No events found")
    return EventCollection(events=events)


@router.post(
    "/events/",
    response_description="Create a new event",
    response_model=EventModel,
    response_model_by_alias=False,
    status_code=status.HTTP_201_CREATED,
)
async def create_event(event: EventModelCreate):
    event_data = event.dict()
    new_event = await db.get_collection("events").insert_one(event_data)
    created_event = await db.get_collection("events").find_one({"_id": new_event.inserted_id})
    check_for_none(created_event, "Event not found after creation")
    return EventModel(**created_event)


@router.get(
    "/events/{event_id}",
    response_description="Get a single event",
    response_model=EventModel,
    response_model_by_alias=False,
)
async def get_event(event_id: str):
    event = await db.get_collection("events").find_one({"_id": ObjectId(event_id)})
    check_for_none(event, "Event not found")
    return EventModel(**event)


@router.put(
    "/events/{event_id}",
    response_description="Update an event",
    response_model=EventModel,
    response_model_by_alias=False,
)
async def update_event(event_id: str, event_update: EventModelUpdate):
    update_result = await db.get_collection("events").update_one(
        {"_id": ObjectId(event_id)},
        {"$set": event_update.dict(exclude_unset=True)},
    )
    check_update_result(update_result, "Event not found")
    updated_event = await db.get_collection("events").find_one({"_id": ObjectId(event_id)})
    check_for_none(updated_event, "Event not found after update")
    return EventModel(**updated_event)


@router.delete(
    "/events/{event_id}",
    response_description="Delete an event",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_event(event_id: str):
    delete_result = await db.get_collection("events").delete_one({"_id": ObjectId(event_id)})
    check_delete_result(delete_result, "Event not found")
# Wishlist CRUD operations


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


@router.post(
    "/events/{event_id}/wishlists/",
    response_description="Create a new wishlist",
    response_model=WishlistModel,
    response_model_by_alias=False,
    status_code=status.HTTP_201_CREATED,
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


@router.get(
    "/wishlists/{wishlist_id}",
    response_description="Get a wishlist",
    response_model=WishlistModel,
    response_model_by_alias=False,
)
async def get_wishlist(wishlist_id: str):
    wishlist = await db.get_collection("wishlists").find_one({"_id": ObjectId(wishlist_id)})
    check_for_none(wishlist, "Wishlist not found")
    return WishlistModel(**wishlist)


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
    updated_wishlist = await db.get_collection("wishlists").find_one({"_id": ObjectId(wishlist_id)})
    check_for_none(updated_wishlist, "Wishlist not found after update")
    return WishlistModel(**updated_wishlist)


@router.delete(
    "/wishlists/{wishlist_id}",
    response_description="Delete a wishlist",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_wishlist(wishlist_id: str):
    delete_result = await db.get_collection("wishlists").delete_one({"_id": ObjectId(wishlist_id)})
    check_delete_result(delete_result, "No deleted wishlist found")
# Wishlist Item CRUD operations


@router.get(
    "/wishlists/{wishlist_id}/items/",
    response_description="Get all items in a wishlist",
    response_model=WishlistItemCollection,
    response_model_by_alias=False,
)
async def get_wishlist_items(wishlist_id: str):
    items = await db.get_collection("wishlist_items").find({"wishList": wishlist_id}).to_list(1000)
    check_list_not_empty(items, "No items found in this wishlist")
    return WishlistItemCollection(wishlistItems=items)


@router.post(
    "/wishlists/{wishlist_id}/items/",
    response_description="Create a new wishlist item",
    response_model=WishlistItemModel,
    response_model_by_alias=False,
    status_code=status.HTTP_201_CREATED,
)
async def create_wishlist_item(wishlist_id: str, item: WishlistItemModelCreate):
    item_data = item.dict()
    item_data["wishList"] = wishlist_id
    result = await db.get_collection("wishlist_items").insert_one(item_data)
    new_item = await db.get_collection("wishlist_items").find_one({"_id": result.inserted_id})
    check_for_none(new_item, "Wishlist item not found after creation")
    return WishlistItemModel(**new_item)


@router.get(
    "/wishlist-items/{item_id}",
    response_description="Get a wishlist item",
    response_model=WishlistItemModel,
    response_model_by_alias=False,
)
async def get_wishlist_item(item_id: str):
    item = await db.get_collection("wishlist_items").find_one({"_id": ObjectId(item_id)})
    check_for_none(item, "Wishlist item not found")
    return WishlistItemModel(**item)


@router.put(
    "/wishlist-items/{item_id}",
    response_description="Update a wishlist item",
    response_model=WishlistItemModel,
    response_model_by_alias=False,
)
async def update_wishlist_item(item_id: str, item_update: WishlistItemModelUpdate):
    update_result = await db.get_collection("wishlist_items").update_one(
        {"_id": ObjectId(item_id)},
        {"$set": item_update.dict(exclude_unset=True)},
    )
    check_update_result(update_result, "Wishlist item not found")
    updated_item = await db.get_collection("wishlist_items").find_one({"_id": ObjectId(item_id)})
    check_for_none(updated_item, "Wishlist item not found after update")
    return WishlistItemModel(**updated_item)


@router.delete(
    "/wishlist-items/{item_id}",
    response_description="Delete a wishlist item",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_wishlist_item(item_id: str):
    delete_result = await db.get_collection("wishlist_items").delete_one({"_id": ObjectId(item_id)})
    check_delete_result(delete_result, "Wishlist item not found")
