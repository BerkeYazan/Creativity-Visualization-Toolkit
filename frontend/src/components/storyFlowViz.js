// StoryFlowViz.jsx
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const StoryFlowViz = ({ elements, coherenceScore, creativityScore }) => {
  const nodeColors = {
    opening: '#2196f3',
    character: '#4caf50',
    action: '#ff9800',
    goal: '#f44336',
    location: '#9c27b0',
    character_descriptor: '#3f51b5',
    goal_descriptor: '#e91e63',
    descriptor: '#607d8b',
    subject: '#795548'
  };

  // Filter out invalid elements
  const validElements = elements.filter(element => element && element.type && element.text);

  return (
    <Paper 
      elevation={2}
      sx={{ 
        p: 3, 
        my: 3, 
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
      }}
    >
      <Typography variant="h6" gutterBottom>Story Flow</Typography>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        position: 'relative',
        overflowX: 'auto',
        pb: 2
      }}>
        {validElements.map((element, index) => {
          // Add safety checks
          const elementType = element?.type || 'unknown';
          const elementText = element?.text || '';
          const typeColor = nodeColors[elementType] || '#999';

          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    height: 2,
                    width: 50,
                    backgroundColor: '#ccc',
                    margin: '0 10px'
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
                    backgroundColor: `${typeColor}10`
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {elementType.replace(/_/g, ' ')}
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