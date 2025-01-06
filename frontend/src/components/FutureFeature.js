// frontend/src/components/FutureFeature.js
import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function FutureFeature() {
  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto" }}>
      <Typography 
        variant="h4" 
        align="center" 
        sx={{ 
          mb: 4,
          fontWeight: 500,
          letterSpacing: '0.5px'
        }}
      >
        Coming Soon
      </Typography>
      
      <Paper 
        elevation={0}
        sx={{ 
          p: 4,
          bgcolor: '#fafafa',
          borderRadius: 3,
          textAlign: 'center'
        }}
      >
        <Typography 
          variant="body1"
          color="text.secondary"
          sx={{ letterSpacing: '0.3px' }}
        >
          New creative features are currently in development.
        </Typography>
      </Paper>
    </Box>
  );
}

export default FutureFeature;