# backend/app/routes/story_routes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from anthropic import Anthropic
import os
import json
import logging
import traceback

router = APIRouter()

class StoryCircleRequest(BaseModel):
    theme: str
    strands: int

# backend/app/routes/story_routes.py
@router.post("/generate-story-circle")
async def generate_story_circle(request: StoryCircleRequest):
    try:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="API key not configured")

        client = Anthropic(api_key=api_key)
        strands = []
        
        # Enhanced prompt with explicit formatting
        base_prompt = """Generate a story DNA strand with 12 phases for theme: {theme}.
        Follow Joseph Campbell's Hero's Journey strictly:
        {phase_list}
        
        Return ONLY a JSON array with EXACTLY 12 objects using this format:
        [
            {{"phase": 1, "name": "Ordinary World", "description": "..."}},
            {{"phase": 2, "name": "Call to Adventure", "description": "..."}},
            ...
        ]"""

        phase_list = "\n".join([
            f"{idx}. {name}" for idx, name in [
                (1, "Ordinary World"),
                (2, "Call to Adventure"),
                (3, "Refusal of the Call"),
                (4, "Meeting the Mentor"),
                (5, "Crossing the Threshold"),
                (6, "Tests, Allies, Enemies"),
                (7, "Approach to the Inmost Cave"),
                (8, "Ordeal"),
                (9, "Reward"),
                (10, "The Road Back"),
                (11, "Resurrection"),
                (12, "Return with the Elixir")
            ]
        ])

        for _ in range(request.strands):
            full_prompt = base_prompt.format(
                theme=request.theme,
                phase_list=phase_list
            )

            response = client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=2000,
                temperature=0.7,
                messages=[{"role": "user", "content": full_prompt}]
            )

            try:
                raw_content = response.content[0].text
                
                # Enhanced JSON cleaning
                json_start = raw_content.find('[')
                json_end = raw_content.rfind(']') + 1
                json_str = raw_content[json_start:json_end]
                
                phases = json.loads(json_str)
                
                # Validate structure
                if len(phases) != 12:
                    raise ValueError("Expected exactly 12 phases")
                    
                validated_phases = []
                for idx, phase in enumerate(phases, 1):
                    if not isinstance(phase, dict):
                        raise ValueError(f"Phase {idx} is not an object")
                    if "phase" not in phase or "description" not in phase:
                        raise ValueError(f"Phase {idx} missing required fields")
                    if phase["phase"] != idx:
                        raise ValueError(f"Phase numbering error at position {idx}")
                        
                    validated_phases.append({
                        "phase": phase["phase"],
                        "name": phase.get("name", f"Phase {idx}"),
                        "description": phase["description"][:500]  # Limit length
                    })
                
                strands.append({"phases": validated_phases})
                
            except (json.JSONDecodeError, ValueError) as e:
                logging.error(f"JSON Parse Error: {str(e)}")
                logging.error(f"Raw Claude Response:\n{raw_content}")
                raise HTTPException(
                    status_code=422,
                    detail=f"AI response format error: {str(e)}"
                )

        return strands

    except Exception as e:
        logging.error(f"Server Error: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))