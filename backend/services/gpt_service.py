import aiohttp
from config import settings

async def process_text(text):
    async with aiohttp.ClientSession() as session:
        async with session.post(
            "https://api.openai.com/v1/chat/completions",
            headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
            json={
                "model": "gpt-4",
                "messages": [{"role": "user", "content": text}]
            }
        ) as response:
            if response.status == 200:
                result = await response.json()
                return result["choices"][0]["message"]["content"]
            else:
                raise Exception(f"Error processing text with GPT: {await response.text()}")