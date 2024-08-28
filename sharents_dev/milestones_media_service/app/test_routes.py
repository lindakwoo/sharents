import pytest
from fastapi import FastAPI
from httpx import AsyncClient
from unittest.mock import AsyncMock
from app.main import app  # Correct import for your FastAPI app


@pytest.fixture
def test_app():
    return app


@pytest.mark.asyncio
async def test_post_comment_on_milestone_success(monkeypatch, test_app):
    # Mock comment data to be inserted
    mock_comment_data = {
        "text": "This is a test comment",
        "member": "test_member_id",
        "guardian": None,
        "creator_name": "Test User"
    }

    # Mock data returned by the find_one method, resembling the CommentModel
    mock_find_one_data = {
        "id": None,
        "milestone": "test_milestone_id",
        "text": "This is a test comment",
        "member": "test_member_id",
        "guardian": None,
        "creator_name": "Test User",
        "media": None,
    }

    # Mock database insert and find operations
    async def mock_insert_one(self, document):
        class MockInsertResult:
            inserted_id = "test_inserted_id"
        return MockInsertResult()

    async def mock_find_one(self, query):
        return mock_find_one_data

    # Apply the monkeypatch
    monkeypatch.setattr(
        "app.database.db.get_collection",
        lambda collection_name: type(
            "", (), {"insert_one": mock_insert_one, "find_one": mock_find_one})()
    )

    test_milestone_id = "test_milestone_id"
    url = f"/api/milestones/{test_milestone_id}/comments/"

    # Create a test client
    async with AsyncClient(app=test_app, base_url="http://test") as ac:
        response = await ac.post(url, json=mock_comment_data)

    response_json = response.json()

    # Assertions to check if the response is as expected
    assert response.status_code == 200
    assert response_json == mock_find_one_data


@pytest.mark.asyncio
async def test_post_media_for_a_child_success(monkeypatch, test_app):
    # mock media data to be inseted
    mock_media_data = {
        "description": "string",
        "category": "growth",
        "date": "string",
        "type": "string",
        "url": "string"
    }

    # mock data returned by the find_one method, resembling the MediaModel
    mock_find_one_data = {
        "id": None,
        "description": "string",
        "category": "growth",
        "child": "test_child_id",
        "date": "string",
        "type": "string",
        "url": "string",
        "created_at": "string",
    }

    # mock database insert and find operations
    async def mock_insert_one(self, document):
        class MockInsertResult:
            inserted_id = "test_inserted_id"
        return MockInsertResult()

    async def mock_find_one(self, query):
        return mock_find_one_data

    # apply the monkey patch
    monkeypatch.setattr(
        "app.database.db.get_collection",
        lambda collection_name: type(
            "", (), {"insert_one": mock_insert_one, "find_one": mock_find_one})()
    )

    test_child_id = "test_child_id"
    url = f"/api/media/children/{test_child_id}/"

    # create a test client
    async with AsyncClient(app=test_app, base_url="http://test") as ac:
        response = await ac.post(url, json=mock_media_data)

    response_json = response.json()

    # assertions to check if the response is as expected
    assert response.status_code == 200
    assert response_json == mock_find_one_data
