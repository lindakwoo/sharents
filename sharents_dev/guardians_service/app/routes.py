from fastapi import APIRouter, HTTPException, status, Depends
from typing import List


from .schemas import GuardianModel
from .guardians_service import (
    get_all_guardians,
    get_guardian_by_id,
    delete_guardian,
    update_guardian,
    create_guardian,
)

# Removed imports for UserModel and get_current_user

router = APIRouter()

# ... Existing routes with modifications ...


# Route to create a new guardian (no authentication required)
@router.post(
    "/guardians/", response_model=GuardianModel, status_code=status.HTTP_201_CREATED
)
async def create_guardian_route(guardian: GuardianModel):
    """
    Create a new guardian.
    """
    return await create_guardian(guardian)


# Route to retrieve a guardian by ID (no authentication required)
@router.get(
    "/guardians/{guardian_id}",
    response_model=GuardianModel,
    response_model_by_alias=False,

)
async def get_guardian_route(guardian_id: str):
    """
    Retrieve a guardian by their ID.
    """
    return await get_guardian_by_id(guardian_id)


# Route to update a guardian's information (no authentication required)
@router.put(
    "/guardians/{guardian_id}",
    response_model=GuardianModel,
    response_model_by_alias=False,
)
async def update_guardian_route(guardian_id: str, guardian_data: GuardianModel):
    """
    Update a guardian's information.
    """
    return await update_guardian(guardian_id, guardian_data.dict())


# Route to delete a guardian (no authentication required)
@router.delete("/guardians/{guardian_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_guardian_route(guardian_id: str):
    """
    Delete a guardian by their ID.
    """
    await delete_guardian(guardian_id)
    return None


# Route to get all guardians (no authentication required)
@router.get(
    "/guardians/", response_model=List[GuardianModel], response_model_by_alias=False
)
async def get_all_guardians_route():
    """
    Retrieve all guardians.
    """
    return await get_all_guardians()
