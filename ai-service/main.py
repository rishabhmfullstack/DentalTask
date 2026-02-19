from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

from typing import Optional

class ChatRequest(BaseModel):
    message: str
    patient_context: Optional[dict] = None

@app.post("/generate")
async def generate_response(request: ChatRequest):
    try:
        # Mock logic or Real LLM call
        # For the assessment, we default to a smart mock to avoid API key requirement
        
        patient_name = "the patient"
        if request.patient_context and 'name' in request.patient_context:
            patient_name = request.patient_context['name']
            
        response = f"Hello! As a dental assistant, I verify that I received your message: '{request.message}'. How can I help {patient_name} today?"
        
        # In a real scenario, we would use:
        # response = openai.ChatCompletion.create(...)
        
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
