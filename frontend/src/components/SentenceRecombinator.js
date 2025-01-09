import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Container,
  TextField,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { ShuffleRounded, Refresh } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import StoryFlowViz from "./storyFlowViz";

const ScrollContainer = styled(Box)(({ theme }) => ({
  overflowX: "auto",
  overflowY: "hidden",
  "&::-webkit-scrollbar": {
    height: 6,
  },
  "&::-webkit-scrollbar-track": {
    background: "#e0e0e0",
    borderRadius: 3,
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#bdbdbd",
    borderRadius: 3,
    "&:hover": {
      background: "#9e9e9e",
    },
  },
  scrollBehavior: "smooth",
}));

const StoryContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: 16,
  backgroundColor: "#ffffff",
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
  position: "relative",
  overflow: "hidden",
}));

const ScoreCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  backgroundColor: "#ffffff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: 150,
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
}));

const SentenceElement = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isSelected" && prop !== "color",
})(({ color, isSelected, theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 16px",
  margin: "0 4px",
  cursor: "pointer",
  borderRadius: 12,
  minWidth: "fit-content",
  border: `1px solid ${isSelected ? color : "transparent"}`,
  backgroundColor: isSelected ? `${color}10` : "#fafafa",
  boxShadow: isSelected ? `0 2px 12px ${color}20` : "none",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: `${color}05`,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 15px ${color}15`,
  },
}));

const ElementType = styled(Chip)({
  marginLeft: 8,
  fontSize: "0.65rem",
  height: 20,
  borderRadius: 10,
  fontWeight: 500,
  transition: "all 0.2s ease",
});

const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  backgroundColor: "#e0e0e0",
  "& .MuiLinearProgress-bar": {
    borderRadius: 4,
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 10,
  textTransform: "none",
  padding: "8px 24px",
  fontWeight: 600,
  boxShadow: "none",
  transition: "all 0.2s ease",
  "&:hover": {
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-1px)",
  },
}));

const HistoryPanel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  borderRadius: 16,
  backgroundColor: "#ffffff",
  maxHeight: 400,
  overflowY: "auto",
}));

export default function SentenceRecombinator() {
  const [sentences, setSentences] = useState([]);
  const [selectedElements, setSelectedElements] = useState([]);
  const [coherenceScore, setCoherenceScore] = useState(0);
  const [creativityScore, setCreativityScore] = useState(0);
  const [storyTheme, setStoryTheme] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const scrollRef = useRef(null);

  const handleGenerateStory = async () => {
    if (!storyTheme.trim()) {
      alert("Please enter a story theme");
      return;
    }

    setIsGenerating(true);
    setSelectedElements([]);

    try {
      const response = await axios.post(
        "http://localhost:8001/api/generate-story",
        { theme: storyTheme }
      );

      const rows = response.data.story.trim().split("\n");
      const transformedSentences = rows
        .map((row, index) => {
          const parts = row
            .split(";")
            .map((part) => part.trim().replace(/^"(.+)"$/, "$1"));

          if (parts.length !== 10) {
            console.error(`Invalid row format: ${row}`);
            return null;
          }

          return {
            id: parts[0],
            color: parts[9],
            elements: [
              { type: "location_descriptor", text: parts[1], article: "the" },
              { type: "location", text: parts[2], article: "the" },
              { type: "character_descriptor", text: parts[3], article: "a" },
              { type: "character", text: parts[4], article: "a" },
              { type: "action_descriptor", text: parts[5], article: "a" },
              { type: "action", text: parts[6], article: "a" },
              { type: "goal_descriptor", text: parts[7], article: "a" },
              { type: "goal", text: parts[8], article: "a" },
            ].filter((el) => el.text && el.text !== "null" && el.text !== ""),
          };
        })
        .filter(Boolean);

      setSentences(transformedSentences);
    } catch (error) {
      console.error("Error:", error);
      alert(`Error generating story: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const typeOrder = {
    location_descriptor: 1,
    location: 2,
    character_descriptor: 3,
    character: 4,
    action_descriptor: 5,
    action: 6,
    goal_descriptor: 7,
    goal: 8,
  };

  const sortElementsByType = (elements) => {
    return [...elements].sort((a, b) => typeOrder[a.type] - typeOrder[b.type]);
  };

const handleElementClick = (element, color) => {
  setSelectedElements((prev) => {
    const elementIndex = prev.findIndex((el) => el.text === element.text);
    if (elementIndex !== -1) {
      const newElements = prev.filter((_, index) => index !== elementIndex);
      setCoherenceScore(0);
      setCreativityScore(0);
      return sortElementsByType(newElements); // Sort when removing
    }
    const newElements = [...prev, { ...element, color }];
    setCoherenceScore(0);
    setCreativityScore(0);
    return sortElementsByType(newElements); // Sort when adding
  });
};

  const orderedTypes = Object.entries(typeOrder)
    .sort(([, a], [, b]) => a - b)
    .map(([type]) => type);

  const handleShuffle = () => {
    const newStory = orderedTypes
      .map((type) => {
        const possibleElements = sentences.flatMap((sentence) =>
          sentence.elements.filter((element) => element.type === type)
        );
        if (possibleElements.length === 0) return null;

        const randomElement =
          possibleElements[Math.floor(Math.random() * possibleElements.length)];
        const originalSentence = sentences.find((sentence) =>
          sentence.elements.includes(randomElement)
        );

        return randomElement && originalSentence
          ? { ...randomElement, color: originalSentence.color }
          : null;
      })
      .filter(Boolean);

    setSelectedElements(sortElementsByType(newStory));
    setCoherenceScore(0);
    setCreativityScore(0);
  };

  const handleReset = () => {
    setSelectedElements([]);
  };

  React.useEffect(() => {
    if (selectedElements.length === 0) {
      setCoherenceScore(0);
      setCreativityScore(0);
    }
  }, [selectedElements]);

  const constructSentence = (elements) => {
    if (!elements?.length) return "";

    return (
      elements
        .filter((element) => element?.text)
        .sort((a, b) => {
          const typeOrder = {
            location_descriptor: 1,
            location: 2,
            character_descriptor: 3,
            character: 4,
            action_descriptor: 5,
            action: 6,
            goal_descriptor: 7,
            goal: 8,
          };
          return (typeOrder[a.type] || 99) - (typeOrder[b.type] || 99);
        })
        .map((element) => element.text)
        .filter(Boolean)
        .join(" ") + "."
    );
  };

  const analyzeStory = async () => {
    if (!selectedElements.length) {
      alert("Please create a story first");
      return;
    }

    setIsAnalyzing(true);
    const story = constructSentence(selectedElements);

    try {
      // Make both requests in parallel
      const [coherenceResponse, creativityResponse] = await Promise.all([
        axios.post("http://localhost:8001/api/analyze-story", {
          story,
          analysis_type: "coherence",
        }),
        axios.post("http://localhost:8001/api/analyze-story", {
          story,
          analysis_type: "creativity",
        }),
      ]);

      setCoherenceScore(coherenceResponse.data.score);
      setCreativityScore(creativityResponse.data.score);

      // Add to history with both scores
      setAnalysisHistory((prev) => [
        ...prev,
        {
          timestamp: new Date(),
          story,
          coherenceScore: coherenceResponse.data.score,
          creativityScore: creativityResponse.data.score,
        },
      ]);
    } catch (error) {
      console.error("Error analyzing story:", error);
      alert(`Error analyzing story: ${error.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography 
                variant="h2" 
                sx={{ 
                  textAlign: "center", 
                  mb: 4,
                  fontSize: { xs: "1rem", sm: "2rem" },
                }}
              >
                Story Premise Generator
              </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 4,
          justifyContent: "center",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          label="Story Theme"
          value={storyTheme}
          onChange={(e) => setStoryTheme(e.target.value)}
          placeholder="Enter a story theme (e.g., 'time travel adventure')"
          disabled={isGenerating}
          sx={{
            maxWidth: { sm: 600 },
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "white",
            },
          }}
        />
        <ActionButton
          variant="contained"
          onClick={handleGenerateStory}
          disabled={!storyTheme || isGenerating}
          sx={{
            minWidth: 150,
            height: 56,
            backgroundColor: isGenerating ? "#e0e0e0" : "#3498DB",
            "&:hover": {
              backgroundColor: "#2980B9",
            },
          }}
        >
          {isGenerating ? <CircularProgress size={24} /> : "Generate Story"}
        </ActionButton>
      </Box>

      <StoryContainer>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <ActionButton
              variant="outlined"
              startIcon={<ShuffleRounded />}
              onClick={handleShuffle}
              disabled={sentences.length === 0}
              sx={{ borderColor: "#3498DB", color: "#3498DB" }}
            >
              Shuffle
            </ActionButton>
            <ActionButton
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleReset}
              disabled={selectedElements.length === 0}
              sx={{ borderColor: "#E74C3C", color: "#E74C3C" }}
            >
              Reset
            </ActionButton>
          </Box>

          {selectedElements.length > 0 && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <ScoreCard>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Coherence
                </Typography>
                <StyledLinearProgress
                  variant="determinate"
                  value={coherenceScore}
                  sx={{
                    width: "100%",
                    mb: 1,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#27AE60",
                    },
                  }}
                />
                <Typography variant="h6" color="#27AE60">
                  {Math.round(coherenceScore)}%
                </Typography>
              </ScoreCard>
              <ScoreCard>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Creativity
                </Typography>
                <StyledLinearProgress
                  variant="determinate"
                  value={creativityScore}
                  sx={{
                    width: "100%",
                    mb: 1,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#9B59B6",
                    },
                  }}
                />
                <Typography variant="h6" color="#9B59B6">
                  {Math.round(creativityScore)}%
                </Typography>
              </ScoreCard>
              <ActionButton
                variant="contained"
                onClick={analyzeStory}
                disabled={isAnalyzing}
                sx={{
                  height: "auto",
                  backgroundColor: "#2C3E50",
                  "&:hover": {
                    backgroundColor: "#34495E",
                  },
                }}
              >
                {isAnalyzing ? <CircularProgress size={24} /> : "Analyze Story"}
              </ActionButton>
            </Box>
          )}
        </Box>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Box
              sx={{
                minHeight: 100,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                mb: 4,
              }}
            >
              {selectedElements.length === 0 ? (
                <Typography
                  color="text.secondary"
                  sx={{
                    fontStyle: "italic",
                    textAlign: "center",
                    py: 4,
                  }}
                >
                  {sentences.length > 0
                    ? "Select elements from below or use shuffle to create your story"
                    : "Generate a story to get started"}
                </Typography>
              ) : (
                <Box
                  sx={{
                    backgroundColor: "#f8f9fa",
                    borderRadius: 2,
                    p: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 500,
                      color: "#2C3E50",
                      mb: 2,
                      lineHeight: 1.6,
                    }}
                  >
                    {constructSentence(selectedElements)}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedElements.map((element, index) => (
                      <Chip
                        key={index}
                        label={element.text}
                        onDelete={() => handleElementClick(element)}
                        sx={{
                          backgroundColor: `${element.color}10`,
                          borderColor: element.color,
                          "& .MuiChip-deleteIcon": {
                            color: element.color,
                          },
                          borderRadius: "12px",
                          fontWeight: 500,
                          color: "#2C3E50",
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </motion.div>
        </AnimatePresence>

        {selectedElements.length > 0 && (
          <Box sx={{ height: 200, mb: 4 }}>
            <StoryFlowViz
              elements={selectedElements}
              coherenceScore={coherenceScore}
              creativityScore={creativityScore}
            />
          </Box>
        )}
      </StoryContainer>
      <HistoryPanel>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Analysis History
        </Typography>
        {analysisHistory.length === 0 ? (
          <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
            No analysis history yet
          </Typography>
        ) : (
          analysisHistory.map((entry, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                pb: 2,
                borderBottom:
                  index !== analysisHistory.length - 1
                    ? "1px solid #eee"
                    : "none",
              }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {entry.timestamp.toLocaleString()}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {entry.story}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Chip
                  label={`Coherence: ${entry.coherenceScore}%`}
                  size="small"
                  sx={{
                    backgroundColor: "#27AE6010",
                    color: "#27AE60",
                    fontWeight: 500,
                  }}
                />
                <Chip
                  label={`Creativity: ${entry.creativityScore}%`}
                  size="small"
                  sx={{
                    backgroundColor: "#9B59B610",
                    color: "#9B59B6",
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>
          ))
        )}
      </HistoryPanel>

      <ScrollContainer ref={scrollRef}>
        <Box sx={{ position: "relative", mb: 6 }}>
          {sentences.map((sentence, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "nowrap",
                  my: 2,
                  py: 1,
                  borderLeft: `3px solid ${sentence.color}`,
                  pl: 2,
                }}
              >
                {sentence.elements
                  .filter((element) => element?.text?.trim())
                  .map((element, elementIndex) => (
                    <SentenceElement
                      key={`${element.text}-${elementIndex}`}
                      color={sentence.color}
                      isSelected={selectedElements.some(
                        (sel) => sel.text === element.text
                      )}
                      onClick={() =>
                        handleElementClick(element, sentence.color)
                      }
                      component={motion.div}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "#2C3E50",
                        }}
                      >
                        {element.text}
                      </Typography>
                      <ElementType
                        label={element.type.replace(/_/g, " ")}
                        size="small"
                        sx={{
                          backgroundColor: sentence.color,
                          color: "#fff",
                        }}
                      />
                    </SentenceElement>
                  ))}
              </Box>
            </motion.div>
          ))}
        </Box>
      </ScrollContainer>
    </Container>
  );
}
