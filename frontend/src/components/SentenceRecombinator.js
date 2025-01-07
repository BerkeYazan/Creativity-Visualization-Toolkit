import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Container,
  Tooltip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShuffleRounded,
  Psychology,
  Close as CloseIcon,
  Refresh,
  AutoAwesome,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { loadStoryElements } from "../utils/dataloader";
import StoryFlowViz from "./storyFlowViz";
import {
  calculateCoherence,
  calculateCreativity,
  generateSmartSuggestions,
} from "../utils/storyAnalysis";

// Elegant and minimal scrollbar styling
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

// Styled component for sentence elements with a sleek design
const SentenceElement = styled(Paper)(({ color, isSelected, theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  padding: "6px 14px",
  margin: "0 3px",
  cursor: "pointer",
  borderRadius: 8,
  minWidth: "fit-content",
  border: `1px solid ${isSelected ? color : "#e0e0e0"}`,
  backgroundColor: isSelected ? `${color}10` : "#fafafa",
  boxShadow: isSelected ? `0 2px 8px ${color}20` : theme.shadows[1],
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: `${color}05`,
    transform: "translateY(-1px)",
    boxShadow: `0 4px 12px ${color}15`,
  },
}));

// Styled Chip for element types
const ElementType = styled(Chip)({
  marginLeft: 6,
  fontSize: "0.6rem",
  height: 18,
  transition: "all 0.2s ease",
});

// Insight card with a clean look
const InsightCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: 10,
  backgroundColor: "#ffffff",
  boxShadow: theme.shadows[1],
  transition: "all 0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[3],
  },
}));

// Score display container without background
const ScoreDisplay = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(3),
}));

// Function to determine score color based on value
const getScoreColor = (value) => {
  if (value >= 80) return "#2e7d32"; // Green
  if (value >= 60) return "#ed6c02"; // Yellow-Orange
  if (value >= 40) return "#f57c00"; // Orange
  return "#d32f2f"; // Red
};

// Individual score item with dynamic color
const ScoreItem = ({ label, value }) => {
  const color = getScoreColor(value);
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: "#555",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          color,
          fontWeight: 600,
          lineHeight: 1.2,
        }}
      >
        {value}%
      </Typography>
    </Box>
  );
};

// Styled Suggestion Chip with subtle animations
const SuggestionChip = styled(Chip)(({ theme }) => ({
  backgroundColor: "#f0f0f0",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#e0e0e0",
    transform: "translateY(-1px)",
  },
  "&:active": {
    transform: "translateY(0px)",
  },
}));

export default function SentenceRecombinator() {
  const nodeColors = {
    location_descriptor: "#673ab7",
    location: "#9c27b0",
    character: "#4caf50",
    character_descriptor: "#3f51b5",
    action_descriptor: "#ff9800",
    action: "#ffb74d",
    goal_descriptor: "#e91e63",
    goal: "#f44336",
  };

  const [sentences, setSentences] = useState([]);
  const [selectedElements, setSelectedElements] = useState([]);
  const [insights, setInsights] = useState([]);
  const [showInsights, setShowInsights] = useState(false);
  const [coherenceScore, setCoherenceScore] = useState(0);
  const [creativityScore, setCreativityScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);

  const scrollRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadStoryElements();
      setSentences(data);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedElements.length > 0) {
      const coherence = calculateCoherence(selectedElements);
      const creativity = calculateCreativity(
        selectedElements,
        sentences.flatMap((s) => s.elements)
      );

      setCoherenceScore(coherence);
      setCreativityScore(creativity);

      const newInsights = [
        {
          type: coherence > 70 ? "strength" : "suggestion",
          title: "Narrative Flow",
          content:
            coherence > 70
              ? "Your story has a strong narrative progression."
              : "Consider adjusting the element order for better flow.",
        },
        {
          type: creativity > 70 ? "strength" : "suggestion",
          title: "Creative Elements",
          content:
            creativity > 70
              ? "Your combination shows high creativity."
              : "Try adding more unique elements to stand out.",
        },
      ];

      const newSuggestions = generateSmartSuggestions(
        selectedElements,
        sentences.flatMap((s) => s.elements)
      );

      setSuggestions(newSuggestions);
      setInsights(newInsights);
    } else {
      setCoherenceScore(0);
      setCreativityScore(0);
      setSuggestions([]);
      setInsights([]);
    }
  }, [selectedElements, sentences]);

  const handleElementClick = (element, color) => {
    setSelectedElements((prev) => {
      const elementIndex = prev.findIndex((el) => el.text === element.text);
      if (elementIndex !== -1) {
        return prev.filter((_, index) => index !== elementIndex);
      }
      return [...prev, { ...element, color }];
    });
  };

  const handleShuffle = () => {
    setSelectedElements([]);
    const typeOrder = [
      "location_descriptor",
      "location",
      "character_descriptor",
      "character",
      "action_descriptor",
      "action",
      "goal_descriptor",
      "goal",
    ];

    const newStory = typeOrder
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

        if (!randomElement || !originalSentence) return null;
        return { ...randomElement, color: originalSentence.color };
      })
      .filter(Boolean);

    setSelectedElements(newStory);
  };

  const handleSmartShuffle = () => {
    // Ensure that Smart Shuffle generates a complete story by selecting one element per type
    const requiredTypes = [
      "location_descriptor",
      "location",
      "character_descriptor",
      "character",
      "action_descriptor",
      "action",
      "goal_descriptor",
      "goal",
    ];

    const smartStory = requiredTypes.map((type) => {
      const possibleElements = sentences.flatMap((sentence) =>
        sentence.elements.filter((element) => element.type === type)
      );
      if (possibleElements.length === 0) return null;

      const smartElement =
        possibleElements[Math.floor(Math.random() * possibleElements.length)];
      const originalSentence = sentences.find((sentence) =>
        sentence.elements.includes(smartElement)
      );

      if (!smartElement || !originalSentence) return null;
      return { ...smartElement, color: originalSentence.color };
    }).filter(Boolean);

    setSelectedElements(smartStory);
  };

  const handleReset = () => {
    setSelectedElements([]);
    setInsights([]);
  };

  const constructSentence = (elements) => {
    if (!elements || elements.length === 0) return "";

    return (
      elements
        .filter((element) => element && element.text) // Filter out elements without text
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
          // Assign a high value if type is not found to push it to the end
          const aOrder = typeOrder[a.type] || 99;
          const bOrder = typeOrder[b.type] || 99;
          return aOrder - bOrder;
        })
        .map((element, index) => {
          if (!element.text) return ""; // Additional safety check

          const text = element.article
            ? `${element.article} ${element.text}`
            : element.text;

          return index === 0
            ? text.charAt(0).toUpperCase() + text.slice(1)
            : text;
        })
        .filter(Boolean) // Remove any empty strings
        .join(" ") + "."
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          mb: 4,
          fontWeight: 700,
          fontFamily: "'Merriweather', serif",
          color: "#333",
        }}
      >
        Story Recombinator
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
        <Button
          variant="text"
          startIcon={<ShuffleRounded />}
          onClick={handleShuffle}
          sx={{
            px: 3,
            py: 1,
            color: "#555",
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          Random Shuffle
        </Button>

        <Button
          variant="text"
          startIcon={<AutoAwesome />}
          onClick={handleSmartShuffle}
          sx={{
            px: 3,
            py: 1,
            color: "#555",
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          Smart Shuffle
        </Button>

        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleReset}
          sx={{
            px: 3,
            py: 1,
            borderColor: "#555",
            color: "#555",
            borderRadius: 2,
            textTransform: "none",
            "&:hover": {
              borderColor: "#333",
              backgroundColor: "#f5f5f5",
            },
          }}
        >
          Reset
        </Button>
      </Box>

      <Paper
        elevation={2}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          backgroundColor: "#ffffff",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.05)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#444" }}>
            Your Story
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            {selectedElements.length > 0 && (
              <ScoreDisplay>
                <ScoreItem
                  label="Coherence"
                  value={Math.round(coherenceScore)}
                />
                <ScoreItem
                  label="Creativity"
                  value={Math.round(creativityScore)}
                />
              </ScoreDisplay>
            )}
            <Tooltip title="View Insights">
              <IconButton
                onClick={() => setShowInsights(true)}
                disabled={selectedElements.length === 0}
                sx={{
                  color: selectedElements.length > 0 ? "#555" : "grey.400",
                  transition: "color 0.3s",
                  "&:hover": {
                    color: "#333",
                  },
                }}
              >
                <Psychology />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {selectedElements.length === 0 ? (
                <Typography color="text.secondary" sx={{ fontStyle: "italic" }}>
                  Select elements from below or use shuffle to create your story
                </Typography>
              ) : (
                <>
                  <Typography variant="h6" sx={{ fontWeight: 500, color: "#333" }}>
                    {constructSentence(
                      selectedElements.filter(
                        (element) => element && element.text
                      )
                    )}
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
                          color: "#333",
                        }}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </motion.div>
        </AnimatePresence>

        {selectedElements.length > 0 && (
          <StoryFlowViz
            elements={selectedElements}
            coherenceScore={coherenceScore}
            creativityScore={creativityScore}
          />
        )}

        {suggestions.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <AutoAwesome sx={{ fontSize: 20, color: "#555" }} />
              Recommended Next Elements
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              {suggestions.map((suggestion, index) => {
                // Debugging: Log suggestion details
                console.log("Suggestion:", suggestion);

                // Determine element type and color
                const elementType = suggestion?.type || "unknown";
                const typeColor = nodeColors[elementType] || "#999";

                return (
                  <Tooltip
                    key={index}
                    title={`${elementType.replace(
                      /_/g,
                      " "
                    )} - improves story coherence`}
                    arrow
                  >
                    <SuggestionChip
                      label={suggestion.text || "Suggestion"}
                      onClick={() => handleElementClick(suggestion)}
                      sx={{
                        backgroundColor: `${typeColor}10`,
                        border: `1px solid ${typeColor}30`,
                        "&:hover": {
                          backgroundColor: `${typeColor}15`,
                        },
                        transition: "all 0.2s ease",
                      }}
                      icon={
                        <AutoAwesome sx={{ fontSize: 16, color: typeColor }} />
                      }
                    />
                  </Tooltip>
                );
              })}
            </Box>
          </Box>
        )}
      </Paper>

      <ScrollContainer ref={scrollRef}>
        <Box sx={{ position: "relative", my: 6 }}>
          {sentences.map((sentence, index) => (
            <motion.div key={index}>
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
                  .filter(
                    (element) =>
                      element && element.text && element.text.trim() !== ""
                  )
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
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#444" }}>
                        {element.text}
                      </Typography>
                      <ElementType
                        label={element.type}
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

      <Dialog
        open={showInsights}
        onClose={() => setShowInsights(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ position: "relative", fontFamily: "'Merriweather', serif", color: "#333" }}>
          Story Insights
          <IconButton
            onClick={() => setShowInsights(false)}
            sx={{ position: "absolute", right: 8, top: 8, color: "#555" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {insights.map((insight, index) => (
            <InsightCard key={index}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
                {insight.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {insight.content}
              </Typography>
            </InsightCard>
          ))}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
