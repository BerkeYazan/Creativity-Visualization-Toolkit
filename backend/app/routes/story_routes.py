# story_routes.py
@router.post("/generate-story")
async def generate_story(request: StoryThemeRequest):
    try:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="API key not configured")

        client = Anthropic(api_key=api_key)

        prompt = f"""Create a story based on the theme: {request.theme}. 
        For each stage, provide a rich, self-contained description that can work both alone and as part of a sequence.

        Return ONLY a JSON object with this exact structure:
        {{
            "stages": {{
                "ordinary_world": {{
                    "description": "A complete sentence describing the ordinary world"
                }},
                "call": {{
                    "description": "A complete sentence describing the call to adventure"
                }},
                "refusal": {{
                    "description": "A complete sentence describing the refusal"
                }},
                "mentor": {{
                    "description": "A complete sentence describing meeting the mentor"
                }},
                "threshold": {{
                    "description": "A complete sentence describing crossing the threshold"
                }},
                "tests": {{
                    "description": "A complete sentence describing tests and allies"
                }},
                "approach": {{
                    "description": "A complete sentence describing the approach"
                }},
                "ordeal": {{
                    "description": "A complete sentence describing the ordeal"
                }},
                "reward": {{
                    "description": "A complete sentence describing the reward"
                }},
                "road_back": {{
                    "description": "A complete sentence describing the road back"
                }},
                "resurrection": {{
                    "description": "A complete sentence describing the resurrection"
                }},
                "return": {{
                    "description": "A complete sentence describing the return"
                }}
            }}
        }}"""

        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=2000,
            temperature=0.7,
            messages=[{"role": "user", "content": prompt}]
        )

        story_data = json.loads(response.content[0].text)
        
        # Add error checking
        if not story_data or 'stages' not in story_data:
            raise HTTPException(status_code=500, detail="Invalid story data generated")
            
        print("Generated story data:", story_data)  # Debug print
        return story_data

    except Exception as e:
        print(f"Error generating story: {str(e)}")  # Debug print
        raise HTTPException(status_code=500, detail=str(e))