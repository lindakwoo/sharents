from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from .schemas import MediaCollection, MediaModel, MilestoneCollection, MilestoneModel, CommentCollection, CommentModel, CommentModelCreate
from .database import db
from .utils import check_for_none, check_list_not_empty

router = APIRouter()

#  get all media for a child
@router.get(
    "/children/{child_id}/media/",
    response_description="List all media for a child",
    response_model=MediaModel,
    response_model_by_alias=False,
)
async def list_media_for_child(child_id: str):
    media_collection = await db.get_collection("media").find({"child": child_id}).to_list(length=1000)
    check_list_not_empty(media_collection, "no media found for this child")
    return MediaCollection(media=media_collection)

# get a specific media for a child
@router.get(
    "/media/{media_id}",
    response_description="Get a specific media for a child",
    response_model=MediaModel,
    response_model_by_alias=False,
)
async def get_media_for_child(media_id: str):
    media = await db.get_collection("media").find_one({"_id": ObjectId(media_id)})
    check_list_not_empty(media, "no media found for this child")
    media = MediaModel(**media)
    return media

# post a comment on media
@router.post(
    "/media/{media_id}/comments/",
    response_description="Post a comment on a media",
    response_model=CommentModel,
    response_model_by_alias=False,
)
async def post_comment_on_media(media_id: str, comment: CommentModelCreate):
    comment_dict = comment.model_dump()
    comment_dict["media"] = media_id
    result =  await db.get_collection("comments").insert_one(comment_dict)
    inserted_comment = await db.get_collection("comments").find_one({"media": media_id, "_id": result.inserted_id})
    return inserted_comment

# /media/{media_id}/comments/{comment_id} (get, delete, update)(update or delete a comment on a media )


# get a specific comment on a media
@router.get(
    "/media/{media_id}/comments/{comment_id}/",
    response_description="Get a specific comment on a media",
    response_model=CommentModel,
    response_model_by_alias=False,
)
async def get_comment_on_media(media_id: str, comment_id: str):
    comment = await db.get_collection("comments").find_one({"_id": ObjectId(comment_id), "media": media_id})
    check_for_none(comment, "no comment found for this media")
    comment = CommentModel(**comment)
    return comment

# update a specific comment on a media
@router.put(
    "/media/{media_id}/comments/{comment_id}/",
    response_description="Update a specific comment on a media",
    response_model=CommentModel,
    response_model_by_alias=False,
)
async def update_comment_on_media(media_id: str, comment_id: str, comment: CommentModelCreate):
    comment_dict = comment.model_dump()
    comment_dict["media"] = media_id
    result =  await db.get_collection("comments").update_one({"_id": ObjectId(comment_id), "media": media_id}, {"$set": comment_dict})
    updated_comment = await db.get_collection("comments").find_one({"_id": ObjectId(comment_id), "media": media_id})
    return CommentModel(**updated_comment)

# delete a specific comment on a media
@router.delete(
    "/media/{media_id}/comments/{comment_id}/",
    response_description="Delete a specific comment on a media",
    response_model=CommentModel,
    response_model_by_alias=False,
)
async def delete_comment_on_media(media_id: str, comment_id: str):
    await db.get_collection("comments").delete_one({"_id": ObjectId(comment_id), "media": media_id})
    return "Comment deleted successfully"


#  get all milestones for a child
@router.get(
    "/children/{child_id}/milestones/",
    response_description="List all milestones for a child",
    response_model=MilestoneModel,
    response_model_by_alias=False,
)
async def list_milestones_for_child(child_id: str):
    milestones_collection = await db.get_collection("milestones").find({"child": child_id}).to_list(length=1000)
    return MilestoneCollection(milestones=milestones_collection)

# get a specific milestone for a child
@router.get(
    "/milestones/{milestone_id}/",
    response_description="Get a specific milestone for a child",
    response_model=MilestoneModel,
    response_model_by_alias=False,
)
async def get_milestone_for_child(milestone_id: str):
    milestone = await db.get_collection("milestones").find_one({"_id": ObjectId(milestone_id)})
    milestone = MilestoneModel(**milestone)
    return milestone

# post a comment on a milestone
@router.post(
    "/milestones/{milestone_id}/comments/",
    response_description="Post a comment on a milestone",
    response_model=CommentModel,
    response_model_by_alias=False,
)
async def post_comment_on_milestone(milestone_id: str, comment: CommentModelCreate):
    comment_dict = comment.model_dump()
    comment_dict["milestone"] = milestone_id
    result =  await db.get_collection("comments").insert_one(comment_dict)
    inserted_comment = await db.get_collection("comments").find_one({"milestone": milestone_id, "_id": result.inserted_id})
    return CommentModel(**inserted_comment)




# /milestones/{media_id}/comments/{comment_id} (get, delete, update)(update or delete a comment on a milestone)
