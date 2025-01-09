import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

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

const nodeColors = {
  location_descriptor: "#2196f3",
  location: "#4caf50",
  character_descriptor: "#ff9800",
  character: "#f44336",
  action_descriptor: "#9c27b0",
  action: "#3f51b5",
  goal_descriptor: "#e91e63",
  goal: "#795548",
};

const StoryFlowViz = ({ elements, coherenceScore, creativityScore }) => {
  const validElements = elements.filter(
    (element) => element && element.type && element.text
  );
  const sortedElements = sortElementsByType(validElements);

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        my: 3,
        background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Story Flow
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          overflowX: "auto",
          pb: 2,
        }}
      >
        {sortedElements.map((element, index) => {
          const elementType = element?.type || "unknown";
          const elementText = element?.text || "";
          const typeColor = nodeColors[elementType] || "#999";

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    height: 2,
                    width: 50,
                    backgroundColor: "#ccc",
                    margin: "0 10px",
                  }}
                />
              )}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    borderLeft: `4px solid ${typeColor}`,
                    minWidth: 120,
                    backgroundColor: `${typeColor}10`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {elementType.replace(/_/g, " ")}
                  </Typography>
                  <Typography variant="body2" noWrap>
                    {elementText}
                  </Typography>
                </Paper>
              </motion.div>
            </React.Fragment>
          );
        })}
      </Box>
    </Paper>
  );
};

export default StoryFlowViz;
