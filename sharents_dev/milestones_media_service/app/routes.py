from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from sharents_dev.utils import check_delete_result, check_update_result, check_for_none, check_list_not_empty
from .schemas import MediaCollection, MediaModel, MilestoneCollection, MilestoneModel, CommentCollection, CommentModel, CommentModelCreate
from .database import db

router = APIRouter()

#  get all media for a child
@router.get(
    "/children/{child_id}/media/",
    response_description="List all media for a child",
    response_model=MediaCollection,
    response_model_by_alias=False,
)
async def list_media_for_child(child_id: str):
    media_collection = await db.get_collection("media").find({"child": child_id}).to_list(length=1000)
    check_list_not_empty(media_collection, "no media found for this child")
    return MediaCollection(media=media_collection)

#  get all milestones for a child
@router.get(
    "/children/{child_id}/milestones/",
    response_description="List all milestones for a child",
    response_model=MilestoneCollection,
    response_model_by_alias=False,
)
async def list_milestones_for_child(child_id: str):
    milestones_collection = await db.get_collection("milestones").find({"child": child_id}).to_list(length=1000)
    return MilestoneCollection(milestones=milestones_collection)

# get a specific media
@router.get(
    "/media/{media_id}",
    response_description="Get a specific media",
    response_model=MediaModel,
    response_model_by_alias=False,
)
async def get_media(media_id: str):
    media = await db.get_collection("media").find_one({"_id": ObjectId(media_id)})
    check_list_not_empty(media, "no media found")
    return MediaModel(**media)

# get a specific milestone
@router.get(
    "/milestones/{milestone_id}/",
    response_description="Get a specific milestone",
    response_model=MilestoneModel,
    response_model_by_alias=False,
)
async def get_milestone(milestone_id: str):
    milestone = await db.get_collection("milestones").find_one({"_id": ObjectId(milestone_id)})
    return MilestoneModel(**milestone)


# get all comments on a media
@router.get(
    "/media/{media_id}/comments/",
    response_description="List all comments on a media",
    response_model=CommentCollection,
    response_model_by_alias=False,
)
async def list_comments_on_media(media_id: str):
    comments_collection = db.get_collection("comments")
    check_for_none(comments_collection, "comment collections not found")
    comments_cursor = comments_collection.find({"media": media_id})
    comments = await comments_cursor.to_list(length=1000)
    check_list_not_empty(comments, "no comments found for this media")
    return CommentCollection(comments=comments)

# get all comments on a milestone
@router.get(
    "/milestones/{milestone_id}/comments/",
    response_description="List all comments on a milestone",
    response_model=CommentCollection,
    response_model_by_alias=False,
)
async def list_comments_on_milestone(milestone_id: str):
    comments_collection = db.get_collection("comments")
    check_for_none(comments_collection, "comment collections not found")
    comments_cursor = comments_collection.find({"milestone": milestone_id})
    comments = await comments_cursor.to_list(length=1000)
    check_list_not_empty(comments, "no comments found for this milestone")
    return CommentCollection(comments=comments)

# post a comment on a media
@router.post(
    "/media/{media_id}/comments/",
    response_description="Post a comment",
    response_model=CommentModel,
    response_model_by_alias=False,
)
async def post_comment_on_media(media_id: str, comment: CommentModelCreate):
    comment_dict = comment.model_dump()
    comment_dict["media"] = media_id
    result =  await db.get_collection("comments").insert_one(comment_dict)
    inserted_comment = await db.get_collection("comments").find_one({"media": media_id, "_id": result.inserted_id})
    return inserted_comment

# post a comment on milestone
@router.post(
    "/milestone/{milestone_id}/comments/",
    response_description="Post a comment",
    response_model=CommentModel,
    response_model_by_alias=False,
)
async def post_comment_on_milestone(milestone_id: str, comment: CommentModelCreate):
    comment_dict = comment.model_dump()
    comment_dict["milestone"] = milestone_id
    result =  await db.get_collection("comments").insert_one(comment_dict)
    inserted_comment = await db.get_collection("comments").find_one({"milestone": milestone_id, "_id": result.inserted_id})
    return inserted_comment

# update a specific comment
@router.put(
    "/comments/{comment_id}/",
    response_description="Update a specific comment",
    response_model=CommentModel,
    response_model_by_alias=False,
)
async def update_comment(comment_id: str, comment: CommentModelCreate):
    comment_dict = comment.model_dump()
    result = await db.get_collection("comments").update_one({"_id": ObjectId(comment_id)}, {"$set": comment_dict})
    check_update_result(result, "comment not found")
    updated_comment = await db.get_collection("comments").find_one({"_id": ObjectId(comment_id)})
    check_for_none(updated_comment, "comment not found after update")
    return CommentModel(**updated_comment)

# delete a specific comment
@router.delete(
    "/comments/{comment_id}/",
    response_description="Delete a specific comment",
)
async def delete_comment(comment_id: str):
    result = await db.get_collection("comments").delete_one({"_id": ObjectId(comment_id)})
    check_delete_result(result, "comment not found")
    return {"message": "comment successfully deleted"}