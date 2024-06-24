import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, ThemeProvider } from '@mui/material';
import SpeechInput from './components/SpeechInput';
import TranscriptionHistory from './components/TranscriptionHistory';
import WordFrequency from './components/WordFrequency';
import UniquePhrases from './components/UniquePhrases';
import SimilarUsers from './components/SimilarUsers';
import theme from './theme';
import './App.css';

const App = () => {
  const [transcriptions, setTranscriptions] = useState([]);
  const [wordFrequencies, setWordFrequencies] = useState([]);
  const [similarUsers, setSimilarUsers] = useState([]);

  // Function to fetch word frequencies from backend
  const fetchWordFrequencies = async () => {
    try {
      const response = await fetch('http://localhost:5000/word-frequencies');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch word frequencies: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const wordFrequenciesData = await response.json();
      setWordFrequencies(wordFrequenciesData);
    } catch (error) {
      console.error('Error fetching word frequencies:', error);
    }
  };

  // Function to fetch similar users from backend
  const fetchSimilarUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/similar-users');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch similar users: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const similarUsersData = await response.json();
      setSimilarUsers(similarUsersData);
    } catch (error) {
      console.error('Error fetching similar users:', error);
    }
  };

  // Effect to fetch initial data
  useEffect(() => {
    fetchWordFrequencies();
    fetchSimilarUsers();
  }, []);

  // Function to add transcription
  const addTranscription = (transcription) => {
    setTranscriptions([...transcriptions, transcription]);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" className="container mt-5">
        <Typography variant="h1" align="center" className="custom-header" gutterBottom>
          Voice Analyzer
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <SpeechInput addTranscription={addTranscription} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TranscriptionHistory transcriptions={transcriptions} />
          </Grid>
          <Grid item xs={12} md={6}>
            <WordFrequency transcriptions={transcriptions} />
          </Grid>
          <Grid item xs={12} md={6}>
            <UniquePhrases transcriptions={transcriptions} />
          </Grid>
          <Grid item xs={12} md={6}>
            <SimilarUsers similarUsers={similarUsers} />
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default App;
