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
from .utils import (
    check_for_none,
    check_list_not_empty,
    check_update_result,
    check_delete_result,
)
from .database import db
router = APIRouter()
# Event CRUD operations


@ router.get(
    "/events/children/{child_id}/",
    response_description="Get all child events",
    response_model=EventCollection,
    response_model_by_alias=False,
)
async def get_events(child_id: str):
    event_collection = db.get_collection("events")
    check_for_none(event_collection, "event collections not found")
    events_cursor = event_collection.find({"child": child_id})
    events = await events_cursor.to_list(length=1000)
    check_list_not_empty(events, "no events found for this child")
    return EventCollection(events=events)


# create an event for a child


@ router.post(
    "/events/children/{child_id}/",
    response_description="Create a new event",
    response_model=EventModel,
    response_model_by_alias=False,
    status_code=status.HTTP_201_CREATED
)
async def create_event(event: EventModelCreate, child_id: str):
    event_collection = db.get_collection("events")
    check_for_none(event_collection, "event collections not found")
    event_data = event.model_dump()
    event_data['child'] = child_id
    result = await event_collection.insert_one(event_data)
    new_event = await event_collection.find_one({"_id": result.inserted_id})
    check_for_none(new_event, "Event not found after creation")
    return EventModel(**new_event)


# get one event


@ router.get(
    "/events/{id}",
    response_description="Get an event",
    response_model=EventModel,
    response_model_by_alias=False,
)
async def get_event(id: str):
    event = await db.get_collection("events").find_one({"_id": ObjectId(id)})
    check_for_none(event, "event  not found")
    return EventModel(**event)


# update one event


@ router.put(
    "/events/{id}",
    response_description="Update an event",
    response_model=EventModel,
    response_model_by_alias=False,
)
async def update_event(id: str, event_update: EventModelUpdate):
    update_result = await db.get_collection("events").update_one(
        {"_id": ObjectId(id)},
        {"$set": event_update.dict(exclude_unset=True)}
    )
    check_update_result(update_result, "Updated event not found")
    updated_event = await db.get_collection("events").find_one({"_id": ObjectId(id)})
    check_for_none(updated_event, "Event not found after update")
    return EventModel(**updated_event)

# delete one event


@ router.delete(
    "/events/{id}",
    response_description="Delete an event",
)
async def delete_event(id: str):
    delete_result = await db.get_collection("events").delete_one({"_id": ObjectId(id)})
    check_delete_result(delete_result, "No deleted event found")
    return {"message": "Event successfully deleted"}


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

# get all items in a wishlist


@router.get(
    "/wishlists/{wishlist_id}/wishlistItems/",
    response_description="Get all items in a wishlist",
    response_model=WishlistItemCollection,
    response_model_by_alias=False,
)
async def get_wishlist_items(wishlist_id: str):
    wishlistItems_collection = db.get_collection("wishlist_items")
    check_for_none(wishlistItems_collection,
                   "WishlistItems collection not found")
    wishlistItems_cursor = wishlistItems_collection.find(
        {"wishlist": wishlist_id})
    wishlists = await wishlistItems_cursor.to_list(length=1000)
    print(wishlists)
    check_list_not_empty(wishlists, "No wishlists found for this event")
    return WishlistItemCollection(wishlistItems=wishlists)

# create wishlistItem


@router.post(
    "/wishlists/{wishlist_id}/wishlistItems/",
    response_description="Create a new wishlist item",
    response_model=WishlistItemModel,
    response_model_by_alias=False,
    status_code=status.HTTP_201_CREATED,
)
async def create_wishlistItem(wishlist_id: str, wisthlistItem: WishlistItemModelCreate):
    wishlistItems_collection = db.get_collection("wishlist_items")
    check_for_none(wishlistItems_collection,
                   "WishlistItems collections not found")
    wishlistItem_data = wisthlistItem.model_dump()
    wishlistItem_data["wishlist"] = wishlist_id
    wishlistItem_data["is_purchased"] = False
    result = await wishlistItems_collection.insert_one(wishlistItem_data)
    new_wishlistItem = await wishlistItems_collection.find_one(
        {"_id": result.inserted_id})
    check_for_none(new_wishlistItem, "Wishlist item not found after creation")
    return WishlistItemModel(**new_wishlistItem)


# get a wishlist item
@router.get(
    "/wishlistItems/{wishlistItem_id}",
    response_description="Get a wishlist item",
    response_model=WishlistItemModel,
    response_model_by_alias=False,
)
async def get_wishlist_item(wishlistItem_id: str):
    item = await db.get_collection("wishlist_items").find_one({"_id": ObjectId(wishlistItem_id)})
    check_for_none(item, "Wishlist item not found")
    return WishlistItemModel(**item)


# update a wishlist item
@router.put(
    "/wishlistItems/{wishlistItem_id}",
    response_description="Update a wishlist item",
    response_model=WishlistItemModel,
    response_model_by_alias=False,
)
async def update_wishlist_item(wishlistItem_id: str, wishlistItem_update: WishlistItemModelUpdate):
    update_result = await db.get_collection("wishlist_items").update_one(
        {"_id": ObjectId(wishlistItem_id)},
        {"$set": wishlistItem_update.model_dump(exclude_unset=True)},
    )
    check_update_result(update_result, "Wishlist item not found")
    updated_item = await db.get_collection("wishlist_items").find_one({"_id": ObjectId(wishlistItem_id)})
    check_for_none(updated_item, "Wishlist item not found after update")
    return WishlistItemModel(**updated_item)

#  delete a wishlist item


@router.delete(
    "/wishlistItems/{wishlistItem_id}",
    response_description="Delete a wishlist item",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_wishlist_item(wishlistItem_id: str):
    delete_result = await db.get_collection("wishlist_items").delete_one({"_id": ObjectId(wishlistItem_id)})
    check_delete_result(delete_result, "Wishlist item not found")
    return {"message": "Wishlist item successfully deleted"}
