from .database import db
from .utils import check_for_none
from .schemas import GuardianModel
from bson import ObjectId
from typing import List


async def create_guardian(guardian: GuardianModel) -> GuardianModel:
    """
    Create a new guardian in the database.

    Args:
        guardian (GuardianModel): The guardian data to be created.

    Returns:
        GuardianModel: The created guardian.
    """
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "Guardian collection not found")

    guardian_data = guardian.model_dump()

    result = await guardian_collection.insert_one(guardian_data)
    new_guardian = await guardian_collection.find_one({"_id": result.inserted_id})
    check_for_none(new_guardian, "Guardian not found after creation")

    return GuardianModel(**new_guardian)


async def get_guardian_by_id(guardian_id: str) -> GuardianModel:
    """
    Retrieve a guardian by their ID.

    Args:
        guardian_id (str): The ID of the guardian to retrieve.

    Returns:
        GuardianModel: The guardian data.
    """
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "Guardian collection not found")

    guardian = await guardian_collection.find_one({"_id": ObjectId(guardian_id)})
    check_for_none(guardian, "Guardian not found")

    return GuardianModel(**guardian)


async def update_guardian(guardian_id: str, guardian_data: dict) -> GuardianModel:
    """
    Update an existing guardian's details.

    Args:
        guardian_id (str): The ID of the guardian to update.
        guardian_data (dict): The data to update.

    Returns:
        GuardianModel: The updated guardian.
    """
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "Guardian collection not found")

    update_result = await guardian_collection.update_one(
        {"_id": ObjectId(guardian_id)}, {"$set": guardian_data}
    )
    if update_result.modified_count == 0:
        check_for_none(None, "Guardian not found or no changes applied")

    updated_guardian = await guardian_collection.find_one(
        {"_id": ObjectId(guardian_id)}
    )
    check_for_none(updated_guardian, "Guardian not found after update")

    return GuardianModel(**updated_guardian)


async def delete_guardian(guardian_id: str) -> bool:
    """
    Delete a guardian by their ID.

    Args:
        guardian_id (str): The ID of the guardian to delete.

    Returns:
        bool: True if deletion was successful, False otherwise.
    """
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "Guardian collection not found")

    delete_result = await guardian_collection.delete_one({"_id": ObjectId(guardian_id)})
    if delete_result.deleted_count == 0:
        return False

    return True


async def get_all_guardians() -> List[GuardianModel]:
    """
    Retrieve all guardians from the database.

    Returns:
        List[GuardianModel]: A list of all guardians.
    """
    guardian_collection = db.get_collection("guardians")
    check_for_none(guardian_collection, "Guardian collection not found")

    guardians_cursor = guardian_collection.find({})
    # Fetch all documents
    guardians = await guardians_cursor.to_list(length=None)
    return [GuardianModel(**guardian) for guardian in guardians]
