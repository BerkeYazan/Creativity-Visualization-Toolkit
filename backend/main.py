# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import nltk

try:
    nltk.download('punkt', quiet=True)
except:
    pass

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .routes.text_processing import router as text_processing_router

app.include_router(text_processing_router, prefix="/api")

@app.get("/api/test")
async def test():
    return {"status": "ok"}
