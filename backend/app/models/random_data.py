from beanie import Document
from typing import Dict, Any

class Random(Document):
    payload: Dict[str, Any]

    class Setting:
        name = "random"