# utils.py
from fastapi import HTTPException, status
from typing import List, TypeVar

T = TypeVar('T')


def check_for_none(data, error_message: str):
    if data is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_message)
    return data


def check_list_not_empty(data: List[T], error_message: str):
    if not data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=error_message)
    return data

def convert_object_id(document: dict, id_field: str = "_id") -> dict:
    """
    Convert MongoDB _id to id and optionally remove _id.
    """
    if document and id_field in document:
        document['id'] = str(document[id_field])
        document.pop(id_field, None)
    return document