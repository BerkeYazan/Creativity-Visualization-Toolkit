from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import nltk
import os
from dotenv import load_dotenv

load_dotenv()

try:
    nltk.download('punkt', quiet=True)
except:
    pass

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3001",
        "http://127.0.0.1:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Update this import to use relative import
from .routes.text_processing import router as text_processing_router

app.include_router(text_processing_router, prefix="/api")

@app.get("/api/test")
async def test():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)