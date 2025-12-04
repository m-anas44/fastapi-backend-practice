from fastapi import APIRouter, Request
from app.models.random_data import Random
from typing import Dict, Any
router = APIRouter()

@router.post('/post-random-data', status_code=201)
async def store_random_data(data: Dict[str, Any]):
    saved_data = await Random(payload=data).create()
    return {
    "success": True,
    "data": saved_data.model_dump()
}


