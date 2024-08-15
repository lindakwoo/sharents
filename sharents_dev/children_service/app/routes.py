from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from .schemas import ChildrenCollection, ChildModel, ChildModelCreate
from .database import db, db_invites
from ...utils import (
    check_for_none,
    check_list_not_empty,
    check_update_result,
    check_delete_result,
)

router = APIRouter()

# get all children for the member


@router.get(
    "/members/{member_id}/children/",
    response_description="List all children for memeber",
    response_model=ChildrenCollection,
    response_model_by_alias=False,
)
async def list_children_for_member(member_id: str):
    invite_collection = db_invites.get_collection("invites")
    invites_cursor = invite_collection.find({"member": member_id})
    invites = await invites_cursor.to_list(length=1000)
    child_ids = []
    for invite in invites:
        child_ids.append(invite["child"])
    object_ids = [ObjectId(cid) for cid in child_ids]
    children = []
    for child_id in object_ids:
        child = await db.get_collection("children").find_one({"_id": child_id})
        child_model = ChildModel(**child)  # Convert to ChildModel
        children.append(child_model)
    return ChildrenCollection(children=children)

# get child


@router.get(
    "/children/{child_id}",
    response_description="Get a child",
    response_model=ChildModel,
    response_model_by_alias=False,
)
async def get_event(event_id: str):
    event = await db.get_collection("children").find_one({"_id": ObjectId(event_id)})
    check_for_none(event, "Event not found")
    return EventModel(**event)
