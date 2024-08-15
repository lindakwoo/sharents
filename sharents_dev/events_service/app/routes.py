from .utils import check_for_none, check_list_not_empty, check_update_result, check_delete_result
from .database import db
from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from bson import ObjectId
from .models import Event, Wishlist, WishListItem
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


router = APIRouter()

# get all events for a child


@ router.get(
    "/children/{child_id}/events/",
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
    "/children/{child_id}/events/",
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


# get all wishlists for a child

@ router.post(
    "/events/{event_id}/wishlists/",
    response_description="Create a new wishlist",
    response_model=WishlistModel,
    response_model_by_alias=False,
)
async def create_wishlist(wishlist: WishlistModelCreate, event_id: str, ):
    wishlist_collection = db.get_collection("wishlists")
    check_for_none(wishlist_collection, "wishlists collections not found")
    wishlist_data = wishlist.model_dump()
    wishlist_data['event'] = event_id
    result = await wishlist_collection.insert_one(wishlist_data)
    new_wishlist = await wishlist_collection.find_one({"_id": result.inserted_id})
    check_for_none(new_wishlist, "Wishlist not found after creation")
    return WishlistModel(**new_wishlist)

# get one wishlist


@ router.get(
    "/events/{event_id}/wishlists/",
    response_description="Get a wishlist",
    response_model=WishlistModel,
    response_model_by_alias=False,
)
async def get_wishlist(event_id: str):
    wishlist = await db.get_collection("wishlists").find_one({"event": event_id})
    check_for_none(wishlist, "wishlist collections not found")
    return WishlistModel(**wishlist)

# update a wishlist


@ router.put(
    "/events/{event_id}/wishlists/",
    response_description="Update an wishlist",
    response_model=WishlistModel,
    response_model_by_alias=False,
)
async def update_wishlist(event_id: str, wishlist_update: WishlistModelUpdate):
    update_result = await db.get_collection("wishlists").update_one(
        {"event": event_id},
        {"$set": wishlist_update.dict(exclude_unset=True)}
    )
    check_update_result(update_result, "Updated wishlist not found")
    updated_wishlist = await db.get_collection("wishlists").find_one({"event": event_id})
    check_for_none(updated_wishlist, "Event not found after update")
    return WishlistModel(**updated_wishlist)

# delete a wishlist


@ router.delete(
    "/events/{event_id}/wishlists/",
    response_description="Delete a wishlist",
)
async def delete_wishlist(event_id: str):
    delete_result = await db.get_collection("wishlists").delete_one({"event": event_id})
    check_delete_result(delete_result, "No deleted wishlist found")
    return {"message": "Wishlist successfully deleted"}
