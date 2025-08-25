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
  Slider,
  IconButton,
  Alert,
  Chip,
} from '@mui/material';
import {
  VolumeUp as VolumeIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

interface Voice {
  name: string;
  lang: string;
  voice: SpeechSynthesisVoice;
}

const TextToSpeech: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadVoices();
    // Listen for voice changes
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const loadVoices = () => {
    const availableVoices = window.speechSynthesis.getVoices();
    const voiceList = availableVoices
      .filter(voice => voice.lang.startsWith('en'))
      .map(voice => ({
        name: `${voice.name} (${voice.lang})`,
        lang: voice.lang,
        voice: voice,
      }));
    
    setVoices(voiceList);
    if (voiceList.length > 0 && !selectedVoice) {
      setSelectedVoice(voiceList[0].name);
    }
  };

  const speak = () => {
    if (!text.trim()) {
      setError('Please enter some text to speak');
      return;
    }

    setError('');
    
    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice
    const selectedVoiceObj = voices.find(v => v.name === selectedVoice);
    if (selectedVoiceObj) {
      utterance.voice = selectedVoiceObj.voice;
    }

    // Set properties
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      setError(`Speech synthesis error: ${event.error}`);
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const pause = () => {
    window.speechSynthesis.pause();
  };

  const resume = () => {
    window.speechSynthesis.resume();
  };

  const downloadAudio = () => {
    // Note: Web Speech API doesn't directly support audio download
    // This is a placeholder for future implementation
    setError('Audio download feature coming soon!');
  };

  const clearText = () => {
    setText('');
    stop();
  };

  const formatTime = (text: string): string => {
    const words = text.trim().split(/\s+/).length;
    const timeInSeconds = words / 150; // Average speaking rate
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Text to Speech
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Convert your text to speech using advanced voice synthesis. 
          Choose from multiple voices, adjust speed, pitch, and volume.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <VolumeIcon color="primary" />
                Text Input
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={8}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the text you want to convert to speech..."
                variant="outlined"
                sx={{ mb: 2 }}
              />

              {text.trim() && (
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={`Estimated duration: ${formatTime(text)}`}
                    color="info"
                    variant="outlined"
                  />
                </Box>
              )}

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  startIcon={isPlaying ? <StopIcon /> : <PlayIcon />}
                  onClick={isPlaying ? stop : speak}
                  disabled={!text.trim()}
                >
                  {isPlaying ? 'Stop' : 'Speak'}
                </Button>
                
                {isPlaying && (
                  <Button
                    variant="outlined"
                    startIcon={isPaused ? <PlayIcon /> : <PauseIcon />}
                    onClick={isPaused ? resume : pause}
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                )}

                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={downloadAudio}
                  disabled={!text.trim()}
                >
                  Download Audio
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
              <Typography variant="h6" sx={{ mb: 2 }}>
                Voice Settings
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Voice</InputLabel>
                <Select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  disabled={voices.length === 0}
                >
                  {voices.map((voice) => (
                    <MenuItem key={voice.name} value={voice.name}>
                      {voice.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SpeedIcon />
                  Speed: {rate}x
                </Typography>
                <Slider
                  value={rate}
                  onChange={(_, value) => setRate(value as number)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Pitch: {pitch}
                </Typography>
                <Slider
                  value={pitch}
                  onChange={(_, value) => setPitch(value as number)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Volume: {Math.round(volume * 100)}%
                </Typography>
                <Slider
                  value={volume}
                  onChange={(_, value) => setVolume(value as number)}
                  min={0}
                  max={1}
                  step={0.1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setText('Hello, welcome to our text to speech converter!')}
                >
                  Sample Text
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setRate(0.8);
                    setPitch(1.2);
                    setVolume(0.9);
                  }}
                >
                  Slow & Clear
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setRate(1.5);
                    setPitch(0.9);
                    setVolume(1);
                  }}
                >
                  Fast Reading
                </Button>
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
            Our text-to-speech converter uses the Web Speech API to provide high-quality voice synthesis:
          </Typography>
          <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
            <li>Multiple voice options with different accents and languages</li>
            <li>Adjustable speed, pitch, and volume controls</li>
            <li>Real-time speech synthesis in your browser</li>
            <li>No data sent to external servers</li>
            <li>Works offline once the page is loaded</li>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Perfect for accessibility, language learning, content creation, and more.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default TextToSpeech;
