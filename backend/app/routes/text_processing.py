from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from anthropic import Anthropic
import os
import traceback
import random
import json

router = APIRouter()

class StoryThemeRequest(BaseModel):
    theme: str

class StoryAnalysisRequest(BaseModel):
    story: str
    analysis_type: str

COLOR_POOL = [
    "#1E88E5",  # Bright blue
    "#D81B60",  # Vibrant pink
    "#43A047",  # Fresh green
    "#6D4C41",  # Rich brown
    "#5E35B1",  # Deep purple
    "#E53935",  # Bright red
    "#FF8F00",  # Warm orange
    "#558B2F",  # Forest green
    "#0097A7",  # Teal
    "#8E24AA",  # Purple
]

def get_colors_for_story(num_lines=10):
    if num_lines <= 0:
        return []
    colors = []
    while len(colors) < num_lines:
        colors.extend(COLOR_POOL)
    return colors[:num_lines]

def clean_and_validate_elements(parts):
    """Ensure proper categorization of story elements."""
    cleaned_parts = [p.strip().strip('"') for p in parts]
    
    result = {
        'location_descriptor': cleaned_parts[1],
        'location': cleaned_parts[2],
        'character_descriptor': cleaned_parts[3],
        'character': cleaned_parts[4],
        'action_descriptor': cleaned_parts[5],
        'action': cleaned_parts[6],
        'goal_descriptor': cleaned_parts[7],
        'goal': cleaned_parts[8],
        'color': cleaned_parts[9]
    }
    
    # Handle articles and prepositions
    for key in result:
        if key != 'color':
            text = result[key]
            words = text.split()
            if words and words[0] in ['a', 'an', 'the']:
                # Move article to beginning if it's at the end
                if words[-1] in ['a', 'an', 'the']:
                    words = [words[-1]] + words[:-1]
                result[key] = ' '.join(words)
    
    return result

def clean_and_validate_story(raw_story: str) -> str:
    try:
        lines = [line.strip() for line in raw_story.split('\n') if line.strip()]
        
        cleaned_lines = []
        colors = get_colors_for_story(10)
        
        for i, line in enumerate(lines):
            parts = line.split(';')
            
            # Ensure we have exactly 10 parts
            while len(parts) < 10:
                parts.append('""')
            parts = parts[:10]
            
            # Clean each part
            elements = clean_and_validate_elements(parts)
            
            # Construct cleaned line
            cleaned_line = f'{i+1};"{elements["location_descriptor"]}";"{elements["location"]}";' \
                         f'"{elements["character_descriptor"]}";"{elements["character"]}";' \
                         f'"{elements["action_descriptor"]}";"{elements["action"]}";' \
                         f'"{elements["goal_descriptor"]}";"{elements["goal"]}";' \
                         f'"{colors[i]}"'
            
            cleaned_lines.append(cleaned_line)
        
        # Ensure exactly 10 lines
        while len(cleaned_lines) < 10:
            idx = len(cleaned_lines)
            default_line = f'{idx+1};"default";"default";"default";"default";"default";"default";"default";"default";"{colors[idx]}"'
            cleaned_lines.append(default_line)
        cleaned_lines = cleaned_lines[:10]
        
        return '\n'.join(cleaned_lines)
        
    except Exception as e:
        print(f"Error in clean_and_validate_story: {str(e)}")
        print(f"Raw story: {raw_story}")
        
        fallback_lines = []
        colors = get_colors_for_story(10)
        for i in range(10):
            fallback_line = f'{i+1};"fallback";"fallback";"fallback";"fallback";"fallback";"fallback";"fallback";"fallback";"{colors[i]}"'
            fallback_lines.append(fallback_line)
        return '\n'.join(fallback_lines)

@router.post("/analyze-story")
async def analyze_story(request: StoryAnalysisRequest):
    try:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="API key not configured")

        client = Anthropic(api_key=api_key)
        
        if not request.story:
            raise HTTPException(status_code=400, detail="Story text is required")
            
        if request.analysis_type not in ["coherence", "creativity"]:
            raise HTTPException(status_code=400, detail="Invalid analysis type")

        if request.analysis_type == "coherence":
            prompt = f"""Analyze this story for coherence: "{request.story}"
            Rate its coherence from 0-100 based on:
            - Logical flow of events
            - Consistency of characters and settings
            - Clear cause-and-effect relationships
            Return ONLY a number 0-100."""
        else:
            prompt = f"""Analyze this story for creativity: "{request.story}"
            Rate its creativity from 0-100 based on:
            - Uniqueness of concept
            - Imaginative combinations
            - Original perspective
            Return ONLY a number 0-100."""

        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=100,
            temperature=0.5,
            messages=[{"role": "user", "content": prompt}]
        )

        try:
            score = int(response.content[0].text.strip())
            score = max(0, min(100, score))
            return {"score": score}
        except ValueError:
            print(f"Invalid score response: {response.content[0].text}")
            raise HTTPException(status_code=500, detail="Failed to parse score from analysis")

    except Exception as e:
        print(f"Error analyzing story: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-story")
async def generate_story(request: StoryThemeRequest):
    try:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="API key not configured")

        client = Anthropic(api_key=api_key)

        colors = get_colors_for_story(10)
        color_list = ', '.join(colors)

        prompt = f"""Generate a creative story based on the theme: {request.theme}. 
        For each line, strictly follow this structure:
        - Location descriptor must be a descriptive phrase about the setting
        - Location must be a specific place or setting
        - Character descriptor must describe the character
        - Character must be the main subject
        - Action descriptor must describe how the action is performed
        - Action must be the main verb
        - Goal descriptor must describe the objective
        - Goal must be the final objective
        - Descriptions shouldn't include 'and'

        Format for each line:
        [number];"[location_desc]";"[location]";"[char_desc]";"[character]";"[action_desc]";"[action]";"[goal_desc]";"[goal]";"[color]"

        Rules:
        - Generate EXACTLY 10 lines
        - Each line MUST have EXACTLY 10 parts
        - Include articles (the/a/an) for character descriptors
        - Make sentences grammatically complete
        - Use these colors in order: {color_list}
        - Keep text fields concise
        - Create a full story premise

        Example of correct elements:
        1;"in the dimly";"lit laboratory";"curious";"scientist";"carefully";"constructs";"mysterious";"time machine";"{colors[0]}"
        """

        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=1500,
            temperature=0.7,
            messages=[{"role": "user", "content": prompt}]
        )

        generated_story = response.content[0].text.strip()
        print("Generated story before cleaning:", generated_story)
        
        cleaned_story = clean_and_validate_story(generated_story)
        print("Final cleaned story:", cleaned_story)
        
        return {"story": cleaned_story}

    except Exception as e:
        print("Error generating story:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))