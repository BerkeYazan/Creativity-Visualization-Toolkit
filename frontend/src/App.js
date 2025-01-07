// src/App.js
import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { 
  CssBaseline, 
  Tabs, 
  Tab, 
  Box, 
  Container,
  Paper
} from '@mui/material';
import HaikuMixer from './components/HaikuMixer';
import SentenceRecombinator from './components/SentenceRecombinator';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h2: {
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
  },
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false}>
        <Paper 
          elevation={0} 
          sx={{ 
            borderRadius: 0,
            minHeight: '100vh',
            backgroundColor: '#fafafa'
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#fff' }}>
            <Container maxWidth="xl">
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="creative mixer tabs"
                sx={{
                  '& .MuiTab-root': {
                    fontSize: '1rem',
                    textTransform: 'none',
                    py: 2,
                  },
                }}
              >
                <Tab 
                  label="Haiku Mixer" 
                  {...a11yProps(0)} 
                />
                <Tab 
                  label="Story Recombinator" 
                  {...a11yProps(1)} 
                />
              </Tabs>
            </Container>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <HaikuMixer />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <SentenceRecombinator />
          </TabPanel>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default App;