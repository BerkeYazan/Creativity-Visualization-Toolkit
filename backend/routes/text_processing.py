from fastapi import APIRouter
import pandas as pd
import nltk
from pathlib import Path

router = APIRouter()

@router.get("/process")
async def process_text():
    try:

        data_path = Path(__file__).parent.parent.parent / "data" / "sample.csv"
        print(f"Looking for file at: {data_path}")

        if not data_path.exists():
            print("File not found, returning empty list")
            return []

        df = pd.read_csv(data_path)
        print(f"Read CSV with contents:\n{df.head()}")

        results = []
        for text in df["text"]:
            text_stripped = text.strip('"')
            try:
                words = nltk.word_tokenize(text_stripped)
            except:
                words = text_stripped.split()

            results.append({
                "original": text_stripped,
                "words": words
            })

        print(f"Processed {len(results)} lines")
        return results

    except Exception as e:
        print(f"Error reading or processing file: {e}")
        return []
