import httpx
from app.core.config import setting

async def send_whatsapp_message(name: str, phone: str, otp: str):
    """Send OTP via WhatsApp Cloud API."""
    payload = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "template",
        "template": {
            "name": "hello_world",  # EXACT template name
            "language": {"code": "en_US"},
            "components": [
                {
                    "type": "body",
                    # "parameters": [
                    #     {"type": "text", "text": name},   # {{1}} → name
                    #     {"type": "text", "text": otp}     # {{2}} → OTP
                    # ]
                }
            ]
        }
    }

    headers = {
        "Authorization": f"Bearer {setting.WA_ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(setting.WHATSAPP_API_URL, json=payload, headers=headers)
        return response.json()
