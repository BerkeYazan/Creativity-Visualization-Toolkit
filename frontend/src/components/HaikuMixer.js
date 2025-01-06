import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  CircularProgress,
  Container,
  Grid,
  Tooltip,
  Divider,
  IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import { 
  AutorenewRounded,
  InfoOutlined,
  TipsAndUpdatesOutlined,
} from "@mui/icons-material";

const EXPANDED_HAIKU_DATA = {
  first: [
    {
      text: "Silent bamboo grove",
      mood: "serene",
      theme: "nature",
      season: "summer",
      imagery: "plant",
      energy: 0.3,
      complexity: 0.4,
      elements: ["tranquility", "growth", "stillness"],
      metaphors: ["peace", "simplicity"],
      sensory: ["visual", "auditory"]
    },
    {
      text: "Mountain peaks emerge",
      mood: "dramatic",
      theme: "nature",
      season: "any",
      imagery: "earth",
      energy: 0.8,
      complexity: 0.6,
      elements: ["power", "height", "revelation"],
      metaphors: ["discovery", "ambition"],
      sensory: ["visual"]
    },
    {
      text: "City lights flicker",
      mood: "contemplative",
      theme: "urban",
      season: "any",
      imagery: "light",
      energy: 0.5,
      complexity: 0.7,
      elements: ["artificiality", "rhythm", "distance"],
      metaphors: ["life", "isolation"],
      sensory: ["visual"]
    },
    {
      text: "Dawn mist awakens",
      mood: "mystical",
      theme: "nature",
      season: "any",
      imagery: "weather",
      energy: 0.4,
      complexity: 0.6,
      elements: ["transformation", "mystery", "beginning"],
      metaphors: ["awakening", "renewal"],
      sensory: ["visual", "tactile"]
    },
    {
      text: "Autumn leaves dancing",
      mood: "joyful",
      theme: "nature",
      season: "autumn",
      imagery: "plant",
      energy: 0.7,
      complexity: 0.5,
      elements: ["movement", "decay", "playfulness"],
      metaphors: ["freedom", "transition"],
      sensory: ["visual", "kinetic"]
    },
    {
      text: "Old temple bell rings",
      mood: "nostalgic",
      theme: "culture",
      season: "any",
      imagery: "urban",
      energy: 0.4,
      complexity: 0.8,
      elements: ["tradition", "sound", "age"],
      metaphors: ["time", "spirituality"],
      sensory: ["auditory", "visual"]
    },
    {
      text: "Lightning splits the sky",
      mood: "dramatic",
      theme: "nature",
      season: "summer",
      imagery: "weather",
      energy: 0.9,
      complexity: 0.7,
      elements: ["power", "suddenness", "light"],
      metaphors: ["revelation", "division"],
      sensory: ["visual", "auditory"]
    },
    {
      text: "Moonlight through silk screens",
      mood: "ethereal",
      theme: "culture",
      season: "any",
      imagery: "light",
      energy: 0.3,
      complexity: 0.8,
      elements: ["filtering", "softness", "night"],
      metaphors: ["mystery", "refinement"],
      sensory: ["visual"]
    },
    {
      text: "Ocean waves thunder",
      mood: "energetic",
      theme: "nature",
      season: "any",
      imagery: "water",
      energy: 0.8,
      complexity: 0.5,
      elements: ["power", "rhythm", "vastness"],
      metaphors: ["strength", "continuity"],
      sensory: ["auditory", "visual"]
    },
    {
      text: "Winter frost sparkles",
      mood: "peaceful",
      theme: "nature",
      season: "winter",
      imagery: "weather",
      energy: 0.4,
      complexity: 0.5,
      elements: ["cold", "light", "decoration"],
      metaphors: ["purity", "transformation"],
      sensory: ["visual"]
    }
  ],
  middle: [
    {
      text: "Through the misty air",
      mood: "mystical",
      theme: "nature",
      season: "any",
      imagery: "weather",
      energy: 0.4,
      complexity: 0.5,
      elements: ["mystery", "atmosphere", "diffusion"],
      metaphors: ["uncertainty", "veil"],
      sensory: ["visual", "tactile"]
    },
    {
      text: "Ravens take their flight",
      mood: "dramatic",
      theme: "nature",
      season: "autumn",
      imagery: "animal",
      energy: 0.7,
      complexity: 0.6,
      elements: ["movement", "freedom", "darkness"],
      metaphors: ["journey", "wisdom"],
      sensory: ["visual", "kinetic"]
    },
    {
      text: "Whispers in the wind",
      mood: "nostalgic",
      theme: "nature",
      season: "any",
      imagery: "weather",
      energy: 0.4,
      complexity: 0.7,
      elements: ["sound", "movement", "mystery"],
      metaphors: ["memory", "communication"],
      sensory: ["auditory", "tactile"]
    },
    {
      text: "Time stands still today",
      mood: "contemplative",
      theme: "consciousness",
      season: "any",
      imagery: "abstract",
      energy: 0.2,
      complexity: 0.8,
      elements: ["stillness", "presence", "moment"],
      metaphors: ["eternity", "awareness"],
      sensory: ["temporal"]
    },
    {
      text: "Cherry petals fall",
      mood: "peaceful",
      theme: "nature",
      season: "spring",
      imagery: "plant",
      energy: 0.3,
      complexity: 0.5,
      elements: ["movement", "beauty", "impermanence"],
      metaphors: ["transition", "grace"],
      sensory: ["visual", "kinetic"]
    },
    {
      text: "Lanterns light the path",
      mood: "ethereal",
      theme: "urban",
      season: "any",
      imagery: "light",
      energy: 0.5,
      complexity: 0.6,
      elements: ["guidance", "warmth", "journey"],
      metaphors: ["hope", "direction"],
      sensory: ["visual"]
    },
    {
      text: "Shadows dance and play",
      mood: "joyful",
      theme: "nature",
      season: "any",
      imagery: "light",
      energy: 0.6,
      complexity: 0.5,
      elements: ["movement", "contrast", "playfulness"],
      metaphors: ["duality", "freedom"],
      sensory: ["visual", "kinetic"]
    },
    {
      text: "Between earth and sky",
      mood: "contemplative",
      theme: "nature",
      season: "any",
      imagery: "abstract",
      energy: 0.4,
      complexity: 0.8,
      elements: ["space", "connection", "vastness"],
      metaphors: ["balance", "existence"],
      sensory: ["spatial"]
    },
    {
      text: "Memories ripple",
      mood: "melancholic",
      theme: "consciousness",
      season: "any",
      imagery: "water",
      energy: 0.3,
      complexity: 0.9,
      elements: ["movement", "reflection", "past"],
      metaphors: ["memory", "disturbance"],
      sensory: ["visual", "emotional"]
    },
    {
      text: "Thunder rolls distant",
      mood: "dramatic",
      theme: "nature",
      season: "summer",
      imagery: "weather",
      energy: 0.8,
      complexity: 0.5,
      elements: ["sound", "distance", "power"],
      metaphors: ["threat", "anticipation"],
      sensory: ["auditory", "spatial"]
    }
  ],
  last: [
    {
      text: "Dreams fade with the dawn",
      mood: "melancholic",
      theme: "consciousness",
      season: "any",
      imagery: "light",
      energy: 0.3,
      complexity: 0.8,
      elements: ["transition", "ending", "dawn"],
      metaphors: ["awakening", "loss"],
      sensory: ["visual", "temporal"]
    },
    {
      text: "Peace settles like snow",
      mood: "serene",
      theme: "nature",
      season: "winter",
      imagery: "weather",
      energy: 0.2,
      complexity: 0.6,
      elements: ["stillness", "covering", "quiet"],
      metaphors: ["peace", "purity"],
      sensory: ["visual", "tactile"]
    },
    {
      text: "Stars guide travelers",
      mood: "mystical",
      theme: "celestial",
      season: "any",
      imagery: "light",
      energy: 0.5,
      complexity: 0.7,
      elements: ["guidance", "journey", "night"],
      metaphors: ["wisdom", "direction"],
      sensory: ["visual"]
    },
    {
      text: "Time flows like water",
      mood: "contemplative",
      theme: "time",
      season: "any",
      imagery: "water",
      energy: 0.4,
      complexity: 0.8,
      elements: ["movement", "continuity", "flow"],
      metaphors: ["impermanence", "continuity"],
      sensory: ["temporal", "kinetic"]
    },
    {
      text: "Cicadas sing loud",
      mood: "energetic",
      theme: "nature",
      season: "summer",
      imagery: "animal",
      energy: 0.8,
      complexity: 0.4,
      elements: ["sound", "intensity", "summer"],
      metaphors: ["celebration", "life"],
      sensory: ["auditory"]
    },
    {
      text: "Mountains touch the sky",
      mood: "dramatic",
      theme: "nature",
      season: "any",
      imagery: "earth",
      energy: 0.7,
      complexity: 0.6,
      elements: ["height", "connection", "vastness"],
      metaphors: ["ambition", "transcendence"],
      sensory: ["visual", "spatial"]
    },
    {
      text: "Autumn leaves return",
      mood: "nostalgic",
      theme: "nature",
      season: "autumn",
      imagery: "plant",
      energy: 0.4,
      complexity: 0.7,
      elements: ["cycle", "return", "change"],
      metaphors: ["renewal", "memory"],
      sensory: ["visual"]
    },
    {
      text: "Moon reflects in pools",
      mood: "ethereal",
      theme: "celestial",
      season: "any",
      imagery: "light",
      energy: 0.3,
      complexity: 0.8,
      elements: ["reflection", "night", "water"],
      metaphors: ["duality", "reflection"],
      sensory: ["visual"]
    },
    {
      text: "Temple bells echo",
      mood: "peaceful",
      theme: "culture",
      season: "any",
      imagery: "sound",
      energy: 0.4,
      complexity: 0.7,
      elements: ["sound", "distance", "spirituality"],
      metaphors: ["tradition", "resonance"],
      sensory: ["auditory", "spatial"]
    },
    {
      text: "Stories end in rain",
      mood: "melancholic",
      theme: "consciousness",
      season: "any",
      imagery: "weather",
      energy: 0.4,
      complexity: 0.9,
      elements: ["ending", "cleansing", "atmosphere"],
      metaphors: ["conclusion", "renewal"],
      sensory: ["auditory", "tactile"]
    }
  ]
};

const calculateHarmonyScore = (first, middle, last) => {
  if (!first || !middle || !last) return 0;

  let totalScore = 0;
  
  // Mood progression scoring with weighted transitions
  const moodTransitions = {
    dramatic: { mystical: 20, energetic: 15, contemplative: 10 },
    serene: { peaceful: 20, contemplative: 15, ethereal: 15 },
    mystical: { ethereal: 20, contemplative: 15, dramatic: 10 },
    contemplative: { serene: 15, melancholic: 15, mystical: 15 },
    melancholic: { nostalgic: 20, contemplative: 15, ethereal: 10 },
    joyful: { energetic: 20, peaceful: 15, dramatic: 10 },
    energetic: { joyful: 20, dramatic: 15, mystical: 10 },
    peaceful: { serene: 20, contemplative: 15, ethereal: 15 },
    nostalgic: { melancholic: 20, contemplative: 15, peaceful: 10 },
    ethereal: { mystical: 20, serene: 15, contemplative: 15 }
  };

  // Score mood transitions
  if (moodTransitions[first.mood]?.[middle.mood]) {
    totalScore += moodTransitions[first.mood][middle.mood];
  }
  if (moodTransitions[middle.mood]?.[last.mood]) {
    totalScore += moodTransitions[middle.mood][last.mood];
  }

  // Energy flow scoring
  const energyFlow = Math.abs(first.energy - middle.energy) + 
                    Math.abs(middle.energy - last.energy);
  const energyScore = Math.round((1 - energyFlow) * 25);
  totalScore += Math.max(0, energyScore);

  // Theme cohesion
  const themes = [first.theme, middle.theme, last.theme];
  const uniqueThemes = new Set(themes);
  totalScore += (3 - uniqueThemes.size) * 10;

  // Element resonance
  const allElements = [...first.elements, ...middle.elements, ...last.elements];
  const elementCount = {};
  allElements.forEach(el => {
    elementCount[el] = (elementCount[el] || 0) + 1;
  });
  const resonantElements = Object.values(elementCount).filter(count => count > 1);
  totalScore += resonantElements.length * 5;

  // Sensory experience
  const uniqueSensory = new Set([
    ...first.sensory,
    ...middle.sensory,
    ...last.sensory
  ]);
  totalScore += uniqueSensory.size * 5;

  return Math.min(100, Math.round(totalScore));
};

const getMoodColor = (mood) => {
  const moodColors = {
    dramatic: "#FF4D4D",
    serene: "#4DACFF",
    mystical: "#9C27B0",
    contemplative: "#4DB6AC",
    melancholic: "#78909C",
    joyful: "#FFB74D",
    energetic: "#FF7043",
    peaceful: "#81C784",
    nostalgic: "#BA68C8",
    ethereal: "#64B5F6"
  };
  return moodColors[mood] || "#757575";
};

const getThemeColor = (theme) => {
  const themeColors = {
    nature: "#66BB6A",
    urban: "#90A4AE",
    culture: "#FF7043",
    consciousness: "#7E57C2",
    celestial: "#5C6BC0",
    time: "#26A69A"
  };
  return themeColors[theme] || "#757575";
};

const HaikuLineCard = ({ line, isSelected, onClick }) => {
  if (!line) return null;

  return (
    <Paper
      component={motion.div}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      elevation={isSelected ? 2 : 1}
      sx={{
        p: 2,
        my: 1,
        cursor: "pointer",
        border: isSelected ? "2px solid #000" : "1px solid #e0e0e0",
        borderRadius: 2,
        backgroundColor: "#fff",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2,
          fontSize: "1.1rem",
          fontWeight: isSelected ? 600 : 400,
          lineHeight: 1.4,
        }}
      >
        {line.text}
      </Typography>

      <Box sx={{ mt: "auto" }}>
        <Box sx={{ display: "flex", gap: 0.5, mb: 1, flexWrap: "wrap" }}>
          <Tooltip title="Mood influences the emotional flow of the haiku">
            <Chip 
              label={line.mood}
              size="small"
              sx={{ 
                backgroundColor: getMoodColor(line.mood),
                color: "#fff",
                fontSize: "0.75rem"
              }}
            />
          </Tooltip>
          <Tooltip title="Theme connects the narrative elements">
            <Chip 
              label={line.theme}
              size="small"
              sx={{ 
                backgroundColor: getThemeColor(line.theme),
                color: "#fff",
                fontSize: "0.75rem"
              }}
            />
          </Tooltip>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <Typography variant="caption" sx={{ mr: 1 }}>
            Energy:
          </Typography>
          <Box
            sx={{
              width: "100%",
              height: 4,
              backgroundColor: "#eee",
              borderRadius: 2,
              overflow: "hidden"
            }}
          >
            <Box
              sx={{
                width: `${line.energy * 100}%`,
                height: "100%",
                backgroundColor: "#000",
                transition: "width 0.3s ease"
              }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {line.elements.map((element, idx) => (
            <Chip
              key={idx}
              label={element}
              size="small"
              variant="outlined"
              sx={{ 
                fontSize: "0.75rem",
                borderColor: "#000",
                color: "#000"
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

const HarmonyWheel = ({ score }) => {
  return (
    <Box sx={{ 
      position: "relative", 
      width: 200, 
      height: 200, 
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={200}
        thickness={4}
        sx={{ color: "#f0f0f0", position: "absolute" }}
      />
      <CircularProgress
        variant="determinate"
        value={score}
        size={200}
        thickness={4}
        sx={{
          position: "absolute",
          color: "#000",
        }}
      />
      <Box sx={{ 
        position: "absolute", 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center" 
      }}>
        <Typography variant="h3" sx={{ fontWeight: 600 }}>
          {score}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Harmony Score
        </Typography>
      </Box>
    </Box>
  );
};

const HarmonyExplanation = ({ first, middle, last }) => {
  if (!first || !middle || !last) return null;

  const explanations = [];
  
  // Analyze mood progression
  if (first.mood === middle.mood || middle.mood === last.mood) {
    explanations.push({
      title: "Mood Continuity",
      detail: "Connected moods create emotional resonance",
      strength: "Strong"
    });
  }

  // Analyze energy flow
  const energyDiff = Math.abs(first.energy - last.energy);
  explanations.push({
    title: "Energy Flow",
    detail: `${energyDiff < 0.3 ? "Smooth" : "Dynamic"} energy progression`,
    strength: energyDiff < 0.3 ? "Strong" : "Moderate"
  });

  // Analyze thematic elements
  const sharedElements = first.elements.filter(el => 
    middle.elements.includes(el) || last.elements.includes(el)
  );
  if (sharedElements.length > 0) {
    explanations.push({
      title: "Element Resonance",
      detail: `Recurring elements: ${sharedElements.join(", ")}`,
      strength: sharedElements.length > 1 ? "Strong" : "Moderate"
    });
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
        Harmony Analysis
      </Typography>
      <Grid container spacing={2}>
        {explanations.map((exp, idx) => (
          <Grid item xs={12} md={4} key={idx}>
            <Paper 
              sx={{ 
                p: 2, 
                height: "100%",
                border: "1px solid #e0e0e0"
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 1 }}>
                {exp.title}
              </Typography>
              <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                {exp.detail}
              </Typography>
              <Chip 
                label={exp.strength} 
                size="small"
                sx={{ 
                  backgroundColor: exp.strength === "Strong" ? "#000" : "#666",
                  color: "#fff"
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const CurrentHaiku = ({ selectedLines }) => {
  if (!selectedLines.first && !selectedLines.middle && !selectedLines.last) {
    return null;
  }

  return (
    <Paper 
      elevation={0}
      sx={{
        p: 4,
        my: 4,
        backgroundColor: "#fafafa",
        border: "1px solid #e0e0e0",
        borderRadius: 2
      }}
    >
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 2,
        maxWidth: 600,
        mx: "auto",
        textAlign: "center"
      }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 300 }}>
          Your Haiku
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 400 }}>
          {selectedLines.first?.text || "___________"}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 400 }}>
          {selectedLines.middle?.text || "___________"}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 400 }}>
          {selectedLines.last?.text || "___________"}
        </Typography>
      </Box>
    </Paper>
  );
};

export default function HaikuMixer() {
  const [selectedLines, setSelectedLines] = useState({
    first: null,
    middle: null,
    last: null
  });
  const [harmonyScore, setHarmonyScore] = useState(0);

  useEffect(() => {
    const { first, middle, last } = selectedLines;
    const score = calculateHarmonyScore(first, middle, last);
    setHarmonyScore(score);
  }, [selectedLines]);

  const generateRandomHaiku = () => {
    const randomLine = (arr) => arr[Math.floor(Math.random() * arr.length)];
    setSelectedLines({
      first: randomLine(EXPANDED_HAIKU_DATA.first),
      middle: randomLine(EXPANDED_HAIKU_DATA.middle),
      last: randomLine(EXPANDED_HAIKU_DATA.last)
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        <Typography 
          variant="h2" 
          sx={{ 
            textAlign: "center", 
            mb: 4,
            fontWeight: 300
          }}
        >
          Haiku Creator
        </Typography>

        <Button
          variant="contained"
          startIcon={<AutorenewRounded />}
          onClick={generateRandomHaiku}
          sx={{ 
            mb: 4, 
            display: "block", 
            mx: "auto",
            px: 4,
            py: 1.5,
            backgroundColor: "#000",
            "&:hover": {
              backgroundColor: "#333"
            }
          }}
        >
          Generate Random Haiku
        </Button>

        <CurrentHaiku selectedLines={selectedLines} />

        {(selectedLines.first || selectedLines.middle || selectedLines.last) && (
          <Box sx={{ mb: 6 }}>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} md={4}>
                <HarmonyWheel score={harmonyScore} />
              </Grid>
              <Grid item xs={12} md={8}>
                <HarmonyExplanation 
                  first={selectedLines.first}
                  middle={selectedLines.middle}
                  last={selectedLines.last}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
              First Line Selection
            </Typography>
            <Box sx={{ 
              maxHeight: "calc(100vh - 400px)", 
              overflowY: "auto",
              pr: 2
            }}>
              {EXPANDED_HAIKU_DATA.first.map((line) => (
                <HaikuLineCard
                  key={line.text}
                  line={line}
                  isSelected={selectedLines.first?.text === line.text}
                  onClick={() => setSelectedLines(prev => ({ ...prev, first: line }))}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
              Middle Line Selection
            </Typography>
            <Box sx={{ 
              maxHeight: "calc(100vh - 400px)", 
              overflowY: "auto",
              pr: 2
            }}>
              {EXPANDED_HAIKU_DATA.middle.map((line) => (
                <HaikuLineCard
                  key={line.text}
                  line={line}
                  isSelected={selectedLines.middle?.text === line.text}
                  onClick={() => setSelectedLines(prev => ({ ...prev, middle: line }))}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
              Last Line Selection
            </Typography>
            <Box sx={{ 
              maxHeight: "calc(100vh - 400px)", 
              overflowY: "auto",
              pr: 2
            }}>
              {EXPANDED_HAIKU_DATA.last.map((line) => (
                <HaikuLineCard
                  key={line.text}
                  line={line}
                  isSelected={selectedLines.last?.text === line.text}
                  onClick={() => setSelectedLines(prev => ({ ...prev, last: line }))}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

