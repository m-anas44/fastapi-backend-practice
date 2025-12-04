from datetime import datetime
from beanie import Document

class Message(Document):
    room: str
    sender: str
    message: str
    timestamp: datetime = datetime.now()

    class Setting:
        name = "message"