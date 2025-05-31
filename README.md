# Creativity Visualization Toolkit

An interactive web toolkit for exploring and analyzing creativity through AI-powered story generation, haiku composition, and narrative structure visualization. Built using React, FastAPI, and Claude 3 Haiku (Anthropic), this tool allows users to craft and analyze creative text with explainable metrics like coherence, creativity, and structural flow.

## Features

### 1. **Haiku Mixer**
- Compose 3-line haikus using curated lines tagged with mood, theme, sensory features, and energy.
- Calculates a **Harmony Score** based on mood transitions, energy flow, and element resonance.

### 2. **Story Recombinator**
- Users recombine narrative building blocks (location, character, action, goal) into short story premises.
- Claude is used to evaluate **Creativity** and **Coherence** of generated stories.

### 3. **Story Circle Generator**
- Visualizes Joseph Campbell’s 12-phase Hero’s Journey as **DNA-like strands**.
- Claude generates multiple strands for a given theme.
- Users can **crossbreed story elements** between strands for creative exploration.

## Tech Stack

- **Frontend**: React, Material UI, D3.js, Framer Motion
- **Backend**:
  - FastAPI (Python) – for story and text generation
  - Express (Node.js) – for static haiku data
- **AI Integration**: Anthropic Claude 3 Haiku model via API
- **Others**: CSV parsing, dynamic visualization, modular components

## Getting Started

### Prerequisites
- Node.js
- Python 3.8+
- An Anthropic API key (`ANTHROPIC_API_KEY` in `.env`)

### 1. Clone the repo
```bash
git clone https://github.com/BerkeYazan/Creativity-Visualization-Toolkit.git
cd Creativity-Visualization-Toolkit
```

### 2. Setup Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

### 3. Setup Frontend (React)
```bash
cd frontend
npm install
npm start
```

Visit `http://localhost:3001` and explore the toolkit

## 📁 Project Structure

```
backend/
  app/
    routes/
      story_routes.py          # Story DNA generator
      text_processing.py       # Creativity/coherence analysis
      haikuRoutes.js           # Static haiku fetcher (Express)
frontend/
  src/components/
    HaikuMixer.js              # Haiku UI
    SentenceRecombinator.js    # Story sentence remix tool
    StoryCircleGenerator.js    # Hero's Journey visualizer
```

## Sample Prompts
- Haiku Mixer: No input needed—interactive only
- Story Recombinator: “A time travel experiment gone wrong”
- Story Circle Generator: “A forgotten prophecy awakens”

## License

MIT License. For academic and research purposes only.

---

🖋️ Created by Berke Yazan
