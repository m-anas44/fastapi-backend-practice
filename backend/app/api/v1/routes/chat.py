from fastapi import APIRouter
from app.models.message import Message

router = APIRouter()

@router.get("/messages/{room}")
async def get_room_messages(room: str):
    msgs = await Message.find(Message.room == room).to_list()
    user_exist = await Message.find_one(Message.sender == "anas")
    if(user_exist):
        print("yes: ", user_exist)
    else:
        print("User not found")
    return msgs

# pywhatkit