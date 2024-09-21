import aiohttp
from config import settings

async def transcribe_audio(audio_file):
    async with aiohttp.ClientSession() as session:
        async with session.post(
            "https://api.openai.com/v1/audio/transcriptions",
            headers={"Authorization": f"Bearer {settings.OPENAI_API_KEY}"},
            data={"model": "whisper-1"},
            files={"file": audio_file}
        ) as response:
            if response.status == 200:
                result = await response.json()
                return result["text"]
            else:
                raise Exception(f"Error transcribing audio: {await response.text()}")