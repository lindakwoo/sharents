# utils.py
from fastapi import HTTPException, status
from typing import List, TypeVar

import logging

T = TypeVar("T")


def check_for_none(data, error_message: str):
    print("data", data)
    if data is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=error_message
        )
    return data


def check_list_not_empty(data: List[T], error_message: str):
    if not data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=error_message)
    return data


def check_update_result(update_result, error_message: str):
    print(update_result)
    if update_result.modified_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=error_message)


def check_delete_result(result, error_message: str):
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=error_message)
