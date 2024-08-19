from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from bson import ObjectId
from .schemas import ChildrenCollection, ChildModel, ChildModelCreate, ChildModelUpdate
from .database import db, db_invites
from .utils import (
    check_for_none,
    check_list_not_empty,
    check_update_result,
    check_delete_result,
)

router = APIRouter()
# get all children


@router.get(
    "/children/",
    response_description="List all children",
    response_model=ChildrenCollection,
    response_model_by_alias=False,
)
async def list_children():
    children_collection = db.get_collection("children")
    check_for_none(children_collection, "children collections not found")
    children = await children_collection.find().to_list(1000)
    check_list_not_empty(children, "no children found")
    return ChildrenCollection(children=children)


# list all of a guardian's children
@router.get(
    "/guardians/{guardian_id}/",
    response_description="Get all child events",
    response_model=ChildrenCollection,
    response_model_by_alias=False,
)
async def get_guardian_children(guardian_id: str):
    children_collection = db.get_collection("children")
    check_for_none(children_collection, "children collection not found")
    children_cursor = children_collection.find({"guardian": guardian_id})
    children = await children_cursor.to_list(length=1000)
    check_list_not_empty(children, "no children found for this child")
    return ChildrenCollection(children=children)


#  create a child


@router.post(
    "/guardians/{guardian_id}/children/",
    response_description="Create a child",
    response_model=ChildModel,
    response_model_by_alias=False,
    status_code=status.HTTP_201_CREATED,
)
async def create_child(child: ChildModelCreate, guardian_id: str):
    children_collection = db.get_collection("children")
    check_for_none(children_collection, "children collections not found")
    child_data = child.model_dump()
    child_data["guardian"] = guardian_id
    result = await children_collection.insert_one(child_data)
    new_child = await children_collection.find_one({"_id": result.inserted_id})
    check_for_none(new_child, "Child not found after creation")
    return ChildModel(**new_child)


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
async def get_child(child_id: str):
    child = await db.get_collection("children").find_one({"_id": ObjectId(child_id)})
    check_for_none(child, "Child not found")
    return ChildModel(**child)


# update a child


@router.put(
    "/children/{id}",
    response_description="Update an child",
    response_model=ChildModel,
    response_model_by_alias=False,
)
async def update_child(id: str, child_update: ChildModelUpdate):
    update_result = await db.get_collection("children").update_one(
        {"_id": ObjectId(id)}, {"$set": child_update.model_dump(exclude_unset=True)}
    )
    check_update_result(update_result, "Updated event not found")
    updated_child = await db.get_collection("children").find_one({"_id": ObjectId(id)})
    check_for_none(updated_child, "Child not found after update")
    return ChildModel(**updated_child)


# delete a child


@router.delete(
    "/children/{id}",
    response_description="Delete a child",
)
async def delete_child(id: str):
    delete_result = await db.get_collection("children").delete_one(
        {"_id": ObjectId(id)}
    )
    check_delete_result(delete_result, "No deleted child found")
    return {"message": "Child successfully deleted"}
