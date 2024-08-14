from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from bson import ObjectId
from .models import Guardian, Member
from .schemas import GuardianCollection, GuardianModel, GuardianModelCreate
from .database import db
from .utils import check_for_none, check_list_not_empty


router = APIRouter()


@router.get(
    "/guardians/",
    response_description="List all guardians",
    response_model=GuardianCollection,
    response_model_by_alias=False,
)
async def list_guardians():
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "guardian collections not found")
    guardians = await guardian_collection.find().to_list(1000)
    check_list_not_empty(guardians, "no guardians found")
    return GuardianCollection(guardians=guardians)


@router.post(
    "/guardians/",
    response_description="Create a guardian",
    response_model=GuardianModel,
    response_model_by_alias=False,
    status_code=status.HTTP_201_CREATED
)
async def create_guardian(guardian: GuardianModelCreate):
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "guardian collections not found")
    result = await guardian_collection.insert_one(guardian.dict())
    new_guardian = await guardian_collection.find_one({"_id": result.inserted_id})
    check_for_none(new_guardian, "Guardian not found after creation")
    return GuardianModel(**new_guardian)
