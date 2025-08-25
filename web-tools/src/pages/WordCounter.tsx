import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  Grid,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TextFields as TextIcon,
  ContentCopy as CopyIcon,
  Clear as ClearIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: number;
  speakingTime: number;
}

const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [stats, setStats] = useState<TextStats>({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
  });

  useEffect(() => {
    calculateStats(text);
  }, [text]);

  const calculateStats = (inputText: string) => {
    const trimmedText = inputText.trim();
    
    // Characters
    const characters = inputText.length;
    const charactersNoSpaces = inputText.replace(/\s/g, '').length;
    
    // Words
    const words = trimmedText ? trimmedText.split(/\s+/).length : 0;
    
    // Sentences (basic detection)
    const sentences = trimmedText ? trimmedText.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
    
    // Paragraphs
    const paragraphs = trimmedText ? inputText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
    
    // Reading time (average 200 words per minute)
    const readingTime = Math.ceil(words / 200);
    
    // Speaking time (average 150 words per minute)
    const speakingTime = Math.ceil(words / 150);

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime,
      speakingTime,
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const clearText = () => {
    setText('');
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 1) return 'Less than 1 minute';
    if (minutes === 1) return '1 minute';
    return `${minutes} minutes`;
  };

  const getWordDensity = () => {
    if (stats.words === 0) return [];
    
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordCount: { [key: string]: number } = {};
    
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
  };

  const wordDensity = getWordDensity();

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Word Counter
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analyze your text with detailed statistics including word count, character count, 
          reading time, and more. Perfect for essays, articles, and content writing.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextIcon color="primary" />
                Text Input
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={12}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start typing or paste your text here..."
                variant="outlined"
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<CopyIcon />}
                  onClick={copyToClipboard}
                  disabled={!text.trim()}
                >
                  Copy Text
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearText}
                  disabled={!text.trim()}
                >
                  Clear Text
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AnalyticsIcon color="primary" />
                Text Statistics
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'rgba(144, 202, 249, 0.1)' }}>
                    <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                      {stats.words}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Words
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
                    <Typography variant="h4" color="success.main" sx={{ fontWeight: 700 }}>
                      {stats.characters}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Characters
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'rgba(255, 152, 0, 0.1)' }}>
                    <Typography variant="h4" color="warning.main" sx={{ fontWeight: 700 }}>
                      {stats.sentences}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sentences
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'rgba(156, 39, 176, 0.1)' }}>
                    <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 700 }}>
                      {stats.paragraphs}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Paragraphs
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Additional Statistics
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Characters (no spaces):
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {stats.charactersNoSpaces}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Reading time:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatTime(stats.readingTime)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Speaking time:
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatTime(stats.speakingTime)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {wordDensity.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Most Common Words
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {wordDensity.map(({ word, count }) => (
                    <Chip
                      key={word}
                      label={`${word} (${count})`}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Writing Tips
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                📝 General Writing
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Keep sentences clear and concise (15-20 words average)<br/>
                • Use active voice when possible<br/>
                • Vary sentence structure for better flow<br/>
                • Break long paragraphs into shorter ones
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                📊 Content Guidelines
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Blog posts: 300-2000 words<br/>
                • Social media: 40-150 characters<br/>
                • Email subject lines: 30-50 characters<br/>
                • Meta descriptions: 150-160 characters
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default WordCounter;
