import socketio
from app.models.message import Message
from app.core.config import setting

sio_server = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins=[setting.DEV_SERVER])
sio_app = socketio.ASGIApp(socketio_server=sio_server, socketio_path="/socket")


@sio_server.event
async def connect(sid, env):
    print(f"{sid}: connected from sockets")

@sio_server.event
async def join_room(sid, data):
    """
    data = { "room": "room1", "username": "Anas" }
    """
    room = data["room"]
    username = data["username"]

    print(f"{username} joined room {room}")

    # Notify others in the room
    await sio_server.enter_room(sid, room)
    
    await sio_server.emit(
        "user_joined",
        {"message": f"{username} joined the room"},
        room=room,
        skip_sid=sid
    )


@sio_server.event
async def message(sid, data):
    """
    data = { "room": "room1", "sender": "Anas", "message": "Hello!" }
    """
    room = data["room"]
    sender = data["sender"]
    message = data["message"]

    print(f"Message from {sender} in room {room}: {message}")

    try:
        await Message(room=room, sender=sender, message=message).create()
    except Exception as e:
        print("DB save error:", e)

    await sio_server.emit(
        "message",
        {"sender": sender, "message": message},
        room=room,
        skip_sid=sid
    )


@sio_server.event
async def disconnect(sid):
    print(f"{sid}: disconnected")