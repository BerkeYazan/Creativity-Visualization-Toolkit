# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import nltk
import os
from dotenv import load_dotenv

load_dotenv()

# Download NLTK data
try:
    nltk.download('punkt', quiet=True)
except:
    pass

app = FastAPI()

# Updated CORS for port 3001
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
from .routes import story_routes, text_processing

app.include_router(story_routes.router, prefix="/api")
app.include_router(text_processing.router, prefix="/api")

@app.get("/api/test")
async def test():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)