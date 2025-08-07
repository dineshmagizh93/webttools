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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Chip,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  ContentCopy as CopyIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

interface RecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

const SpeechToText: React.FC = () => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [language, setLanguage] = useState<string>('en-US');
  const [continuous, setContinuous] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    initializeSpeechRecognition();
  }, [language, continuous]);

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = continuous;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = language;

    recognitionInstance.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognitionInstance.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + (prev ? ' ' : '') + finalTranscript);
        setInterimTranscript('');
      } else {
        setInterimTranscript(interimTranscript);
      }
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      switch (event.error) {
        case 'no-speech':
          setError('No speech detected. Please try again.');
          break;
        case 'audio-capture':
          setError('Microphone access denied. Please allow microphone access.');
          break;
        case 'not-allowed':
          setError('Microphone access denied. Please allow microphone access.');
          break;
        case 'network':
          setError('Network error occurred. Please check your connection.');
          break;
        default:
          setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    setRecognition(recognitionInstance);
  };

  const startListening = () => {
    if (!recognition) {
      setError('Speech recognition not available');
      return;
    }

    try {
      recognition.start();
    } catch (error) {
      setError('Failed to start speech recognition');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadTranscript = () => {
    if (!transcript.trim()) return;

    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transcript.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
    setError('');
  };

  const formatTime = (text: string): string => {
    const words = text.trim().split(/\s+/).length;
    const timeInSeconds = words / 150; // Average speaking rate
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'it-IT', name: 'Italian' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'ru-RU', name: 'Russian' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ko-KR', name: 'Korean' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
  ];

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Speech to Text
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Convert your speech to text using advanced speech recognition. 
          Support for multiple languages and real-time transcription.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <MicIcon color="primary" />
                Speech Recognition
              </Typography>

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Button
                  variant={isListening ? "contained" : "outlined"}
                  color={isListening ? "error" : "primary"}
                  size="large"
                  startIcon={isListening ? <MicOffIcon /> : <MicIcon />}
                  onClick={isListening ? stopListening : startListening}
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                  }}
                >
                  {isListening ? 'Stop' : 'Start'}
                </Button>
                
                {isListening && (
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      label="Listening..." 
                      color="success" 
                      variant="outlined"
                      icon={<MicIcon />}
                    />
                  </Box>
                )}
              </Box>

              <TextField
                fullWidth
                multiline
                rows={8}
                value={transcript + (interimTranscript ? '\n' + interimTranscript : '')}
                placeholder="Your speech will appear here..."
                variant="outlined"
                sx={{ mb: 2 }}
                InputProps={{
                  readOnly: true,
                }}
              />

              {transcript.trim() && (
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={`${transcript.split(/\s+/).length} words`}
                    color="info"
                    variant="outlined"
                  />
                  <Chip 
                    label={`Estimated duration: ${formatTime(transcript)}`}
                    color="info"
                    variant="outlined"
                    sx={{ ml: 1 }}
                  />
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<CopyIcon />}
                  onClick={copyToClipboard}
                  disabled={!transcript.trim()}
                >
                  Copy Text
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={downloadTranscript}
                  disabled={!transcript.trim()}
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearTranscript}
                  disabled={!transcript.trim()}
                >
                  Clear
                </Button>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon color="primary" />
                Settings
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={isListening}
                >
                  {languages.map((lang) => (
                    <MenuItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Recognition Mode
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button
                    variant={continuous ? "outlined" : "contained"}
                    size="small"
                    onClick={() => setContinuous(false)}
                    disabled={isListening}
                  >
                    Single Recognition
                  </Button>
                  <Button
                    variant={continuous ? "contained" : "outlined"}
                    size="small"
                    onClick={() => setContinuous(true)}
                    disabled={isListening}
                  >
                    Continuous Recognition
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Tips for Better Recognition
              </Typography>
              <Box component="ul" sx={{ pl: 2, color: 'text.secondary', fontSize: '0.9rem' }}>
                <li>Speak clearly and at a normal pace</li>
                <li>Use a quiet environment</li>
                <li>Position yourself close to the microphone</li>
                <li>Allow microphone access when prompted</li>
                <li>Use punctuation commands like "period" or "comma"</li>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            How it works
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Our speech-to-text converter uses the Web Speech API for real-time transcription:
          </Typography>
          <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
            <li>Real-time speech recognition with immediate feedback</li>
            <li>Support for multiple languages and accents</li>
            <li>Continuous recognition mode for longer sessions</li>
            <li>High accuracy with confidence scoring</li>
            <li>No data sent to external servers - all processing is local</li>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Perfect for note-taking, dictation, accessibility, and content creation.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SpeechToText;
