from fastapi import APIRouter, UploadFile, File, HTTPException
from services.transcription_service import transcribe_audio
from services.gpt_service import process_text

router = APIRouter()

@router.post("/process-audio/")
async def process_audio(audio: UploadFile = File(...)):
    try:
        transcription = await transcribe_audio(audio.file)
        gpt_response = await process_text(transcription)
        return {"transcription": transcription, "gpt_response": gpt_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))