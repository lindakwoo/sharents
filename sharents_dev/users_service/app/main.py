from fastapi import FastAPI

import os
from dotenv import load_dotenv
load_dotenv()
from typing import Optional, List
from fastapi.responses import Response, HTMLResponse, RedirectResponse
from pydantic import ConfigDict, BaseModel, Field, EmailStr
from pydantic.functional_validators import BeforeValidator
from typing_extensions import Annotated
from bson import ObjectId
import motor.motor_asyncio
from pymongo import ReturnDocument
from fastapi import FastAPI, HTTPException, Request, Depends, Form, Body, status
from fastapi.templating import Jinja2Templates
# from database import get_connection



from app import models, crud, schemas

from app.database import SessionLocal, engine
# app = FastAPI()

# app.include_router(routes.router, prefix="/users", tags=["users"])

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=8001)
client = motor.motor_asyncio.AsyncIOMotorClient(os.getenv("ATLAS_URI"))
db = client.get_database("users")
guardian_collection = db.get_collection("guardians")
#
# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]

models.Base.metadata.create_all(bind=engine)

app = FastAPI()
templates = Jinja2Templates(directory="app/templates")

class GuardianModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    name: str
    email: EmailStr

class GuardianCollection(BaseModel):
    guardians: list[GuardianModel]
# Dependency
@app.get(
    "/guardians/",
    response_description="List all user",
    response_model=GuardianCollection,
    response_model_by_alias=False,
)
async def list_user():
    """
    List all of the student data in the database.

    The response is unpaginated and limited to 1000 results.
    """
    return GuardianCollection(users=await guardian_collection.find().to_list(1000))
