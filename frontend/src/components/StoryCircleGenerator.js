// StoryCircleGenerator.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

const STAGES = [
  { id: "ordinary_world", name: "Ordinary World", color: "#1E88E5" },
  { id: "call", name: "Call to Adventure", color: "#D81B60" },
  { id: "refusal", name: "Refusal", color: "#43A047" },
  { id: "mentor", name: "Meeting Mentor", color: "#6D4C41" },
  { id: "threshold", name: "Crossing Threshold", color: "#5E35B1" },
  { id: "tests", name: "Tests & Allies", color: "#E53935" },
  { id: "approach", name: "Approaching Cave", color: "#FF8F00" },
  { id: "ordeal", name: "Ordeal", color: "#558B2F" },
  { id: "reward", name: "Reward", color: "#0097A7" },
  { id: "road_back", name: "Road Back", color: "#8E24AA" },
  { id: "resurrection", name: "Resurrection", color: "#EF6C00" },
  { id: "return", name: "Return with Elixir", color: "#1565C0" },
];

// StoryCircleGenerator.jsx
// ... (previous imports remain the same)

export default function StoryCircleGenerator() {
  const [theme, setTheme] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedStages, setSelectedStages] = useState([]);
  const [storyElements, setStoryElements] = useState(null);
  const [generatedStory, setGeneratedStory] = useState('');
  const [error, setError] = useState('');
    
  const generateStory = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8001/api/generate-story', {
        theme: theme.trim()
      });

      console.log('API Response:', response.data); // Debug log

      if (response.data && response.data.stages) {
        setStoryElements(response.data);
        setSelectedStages([]);
        setGeneratedStory('');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating story:', error);
      setError(error.message || 'Error generating story elements');
    } finally {
      setLoading(false);
    }
  };

  const toggleStage = (stageId) => {
    setSelectedStages((prevSelectedStages) => {
      if (prevSelectedStages.includes(stageId)) {
        return prevSelectedStages.filter(id => id !== stageId);
      } else {
        return [...prevSelectedStages, stageId];
      }
    });
  };

  const constructStageSentence = (stage, stageId) => {
    const stageName = STAGES.find(s => s.id === stageId)?.name;
    if (!stage || !stage.description) return '';
    return `${stageName}:\n${stage.description}`;
  };

  useEffect(() => {
    if (selectedStages.length > 0 && storyElements?.stages) {
      const story = selectedStages.map(stageId => {
        const stage = storyElements.stages[stageId];
        return stage ? constructStageSentence(stage, stageId) : '';
      }).filter(Boolean).join('\n\n');
      
      setGeneratedStory(story);
    } else {
      setGeneratedStory('');
    }
  }, [selectedStages, storyElements]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* ... (previous Typography and Box components remain the same) */}

      {error && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Story Circle Visualization */}
        <Paper sx={{ flex: 1, p: 3, height: 'fit-content' }}>
          <Box sx={{ 
            width: 500,
            height: 500,
            position: 'relative',
            margin: 'auto'
          }}>
            {STAGES.map((stage, index) => {
              const angle = ((index * 360) / STAGES.length) * (Math.PI / 180);
              const radius = 200;
              const x = 250 + radius * Math.cos(angle - Math.PI / 2);
              const y = 250 + radius * Math.sin(angle - Math.PI / 2);

              return (
                <Box
                  key={stage.id}
                  sx={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    transform: 'translate(-50%, -50%)',
                    cursor: storyElements ? 'pointer' : 'default',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Chip
                    label={stage.name}
                    onClick={() => storyElements && toggleStage(stage.id)}
                    sx={{
                      backgroundColor: selectedStages.includes(stage.id) 
                        ? stage.color 
                        : '#e0e0e0',
                      color: selectedStages.includes(stage.id) 
                        ? 'white' 
                        : 'black',
                      opacity: storyElements ? 1 : 0.6,
                      '&:hover': {
                        backgroundColor: storyElements && selectedStages.includes(stage.id)
                          ? stage.color
                          : '#bdbdbd'
                      }
                    }}
                  />
                </Box>
              );
            })}
          </Box>
        </Paper>

        {/* Generated Story Display */}
        <Paper sx={{ flex: 1, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generated Story Elements
          </Typography>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          ) : generatedStory ? (
            <Typography 
              variant="body1" 
              component="pre" 
              sx={{ 
                whiteSpace: 'pre-wrap',
                fontFamily: 'inherit'
              }}
            >
              {generatedStory}
            </Typography>
          ) : (
            <Typography color="text.secondary" align="center">
              {storyElements 
                ? 'Select story elements from the circle to build your story'
                : 'Generate elements to start building your story'}
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
