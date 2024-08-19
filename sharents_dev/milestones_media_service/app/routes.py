from fastapi import APIRouter, HTTPException, Depends
from typing import List
from bson import ObjectId
from .utils import (
    check_delete_result,
    check_update_result,
    check_for_none,
    check_list_not_empty,
)
from .schemas import (
    MediaCollection,
    MediaModel,
    MediaModelCreate,
    MediaModelUpdate,
    MilestoneCollection,
    MilestoneModel,
    CommentCollection,
    CommentModel,
    CommentModelCreate,
    MilestoneModelCreate,
    MilestoneModelUpdate,
    CategoryCollection,
    CategoryModel,
)
from .database import db
from datetime import datetime

router = APIRouter()

#  get all media for a child


@router.get(
    "/media/children/{child_id}/",
    response_description="List all media for a child",
    response_model=MediaCollection,
    response_model_by_alias=False,
)
async def list_media_for_child(child_id: str):
    media_collection = (
        await db.get_collection("media").find({"child": child_id}).to_list(length=1000)
    )
    check_list_not_empty(media_collection, "no media found for this child")
    return MediaCollection(media=media_collection)


# post media for a child


@router.post(
    "/media/children/{child_id}/",
    response_description="Post media for a child",
    response_model=MediaModel,
    response_model_by_alias=False,
)
async def post_media_for_child(child_id: str, media: MediaModelCreate):
    media_dict = media.model_dump()
    media_dict["child"] = child_id
    result = await db.get_collection("media").insert_one(media_dict)
    inserted_media = await db.get_collection("media").find_one(
        {"child": child_id, "_id": result.inserted_id}
    )
    return MediaModel(**inserted_media)


# post a milestone for a child


@router.post(
    "/milestones/children/{child_id}/",
    response_description="Post a milestone for a child",
    response_model=MilestoneModel,
    response_model_by_alias=False,
)
async def post_milestone_for_child(child_id: str, milestone: MilestoneModelCreate):
    milestone_dict = milestone.model_dump()
    milestone_dict["child"] = child_id
    result = await db.get_collection("milestones").insert_one(milestone_dict)
    inserted_milestone = await db.get_collection("milestones").find_one(
        {"child": child_id, "_id": result.inserted_id}
    )
    return MilestoneModel(**inserted_milestone)


#  get all milestones for a child


@router.get(
    "/milestones/children/{child_id}/",
    response_description="List all milestones for a child",
    response_model=MilestoneCollection,
    response_model_by_alias=False,
)
async def list_milestones_for_child(child_id: str):
    milestones_collection = (
        await db.get_collection("milestones")
        .find({"child": child_id})
        .to_list(length=1000)
    )
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


# update a specific media


@router.put(
    "/media/{media_id}",
    response_description="Update a specific media",
    response_model=MediaModel,
    response_model_by_alias=False,
)
async def update_media(media_id: str, media: MediaModelUpdate):
    media_dict = media.model_dump()
    result = await db.get_collection("media").update_one(
        {"_id": ObjectId(media_id)}, {"$set": media_dict}
    )
    check_update_result(result, "media not found")
    updated_media = await db.get_collection("media").find_one(
        {"_id": ObjectId(media_id)}
    )
    check_for_none(updated_media, "media not found after update")
    return MediaModel(**updated_media)


# delete a specific media


@router.delete(
    "/media/{media_id}",
    response_description="Delete a specific media",
)
async def delete_media(media_id: str):
    result = await db.get_collection("media").delete_one({"_id": ObjectId(media_id)})
    check_delete_result(result, "media not found")
    return {"message": "media successfully deleted"}


# get a specific milestone


@router.get(
    "/milestones/{milestone_id}/",
    response_description="Get a specific milestone",
    response_model=MilestoneModel,
    response_model_by_alias=False,
)
async def get_milestone(milestone_id: str):
    milestone = await db.get_collection("milestones").find_one(
        {"_id": ObjectId(milestone_id)}
    )
    return MilestoneModel(**milestone)


# update a specific milestone


@router.put(
    "/milestones/{milestone_id}/",
    response_description="Update a specific milestone",
    response_model=MilestoneModel,
    response_model_by_alias=False,
)
async def update_milestone(milestone_id: str, milestone: MilestoneModelUpdate):
    milestone_dict = milestone.model_dump()
    result = await db.get_collection("milestones").update_one(
        {"_id": ObjectId(milestone_id)}, {"$set": milestone_dict}
    )
    check_update_result(result, "milestone not found")
    updated_milestone = await db.get_collection("milestones").find_one(
        {"_id": ObjectId(milestone_id)}
    )
    check_for_none(updated_milestone, "milestone not found after update")
    return MilestoneModel(**updated_milestone)


# delete a specific milestone


@router.delete(
    "/milestones/{milestone_id}/",
    response_description="Delete a specific milestone",
)
async def delete_milestone(milestone_id: str):
    result = await db.get_collection("milestones").delete_one(
        {"_id": ObjectId(milestone_id)}
    )
    check_delete_result(result, "milestone not found")
    return {"message": "milestone successfully deleted"}


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
    result = await db.get_collection("comments").insert_one(comment_dict)
    inserted_comment = await db.get_collection("comments").find_one(
        {"media": media_id, "_id": result.inserted_id}
    )
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
    result = await db.get_collection("comments").insert_one(comment_dict)
    inserted_comment = await db.get_collection("comments").find_one(
        {"milestone": milestone_id, "_id": result.inserted_id}
    )
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
    result = await db.get_collection("comments").update_one(
        {"_id": ObjectId(comment_id)}, {"$set": comment_dict}
    )
    check_update_result(result, "comment not found")
    updated_comment = await db.get_collection("comments").find_one(
        {"_id": ObjectId(comment_id)}
    )
    check_for_none(updated_comment, "comment not found after update")
    return CommentModel(**updated_comment)


# delete a specific comment


@router.delete(
    "/comments/{comment_id}/",
    response_description="Delete a specific comment",
)
async def delete_comment(comment_id: str):
    result = await db.get_collection("comments").delete_one(
        {"_id": ObjectId(comment_id)}
    )
    check_delete_result(result, "comment not found")
    return {"message": "comment successfully deleted"}


#  get all the categories
@router.get(
    "/categories/",
    response_description="List all categories",
    response_model=CategoryCollection,
    response_model_by_alias=False,
)
def list_categories():
    categories = db.get_collection("categories")
    return CategoryCollection(categories=categories)


#  get category by id


@router.get(
    "/milestones/categories/{category_id}/",
    response_description="Get a specific category",
    response_model=CategoryModel,
    response_model_by_alias=False,
)
def get_category(category_id: str):
    category = db.get_collection("categories").find_one(
        {"_id": ObjectId(category_id)})
    check_for_none(category, "category not found")
    return CategoryModel(**category)
