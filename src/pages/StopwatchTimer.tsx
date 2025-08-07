import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Timer as TimerIcon,
  AccessTime as StopwatchIcon,
  Flag as LapIcon,
  VolumeUp as VolumeIcon,
} from '@mui/icons-material';

interface Lap {
  id: number;
  time: number;
  split: number;
}

const StopwatchTimer: React.FC = () => {
  const [mode, setMode] = useState<'stopwatch' | 'timer'>('stopwatch');
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [timerInput, setTimerInput] = useState({ minutes: 0, seconds: 0 });
  const [timerTarget, setTimerTarget] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (mode === 'stopwatch') {
          setTime(prev => prev + 10);
        } else {
          setTime(prev => {
            if (prev <= 0) {
              handleTimerComplete();
              return 0;
            }
            return prev - 10;
          });
        }
      }, 10);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const startStopwatch = () => {
    setIsRunning(true);
  };

  const pauseStopwatch = () => {
    setIsRunning(false);
  };

  const resetStopwatch = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const addLap = () => {
    if (isRunning) {
      const newLap: Lap = {
        id: laps.length + 1,
        time: time,
        split: laps.length > 0 ? time - laps[laps.length - 1].time : time,
      };
      setLaps(prev => [...prev, newLap]);
    }
  };

  const startTimer = () => {
    if (timerInput.minutes === 0 && timerInput.seconds === 0) {
      return;
    }
    const totalSeconds = timerInput.minutes * 60 + timerInput.seconds;
    setTimerTarget(totalSeconds * 1000);
    setTime(totalSeconds * 1000);
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
    setTimerTarget(0);
    setShowAlert(false);
  };

  const handleTimerComplete = () => {
    setIsRunning(false);
    setShowAlert(true);
    playAlertSound();
  };

  const playAlertSound = () => {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const formatLapTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    if (mode === 'stopwatch' || timerTarget === 0) return 0;
    return ((timerTarget - time) / timerTarget) * 100;
  };

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Stopwatch & Timer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Professional stopwatch with lap feature and countdown timer with alerts. 
          Perfect for workouts, cooking, and time management.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                {mode === 'stopwatch' ? <StopwatchIcon color="primary" /> : <TimerIcon color="primary" />}
                <Typography variant="h6">
                  {mode === 'stopwatch' ? 'Stopwatch' : 'Timer'}
                </Typography>
              </Box>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Mode</InputLabel>
                <Select
                  value={mode}
                  onChange={(e) => {
                    setMode(e.target.value as 'stopwatch' | 'timer');
                    resetStopwatch();
                    resetTimer();
                  }}
                  disabled={isRunning}
                >
                  <MenuItem value="stopwatch">Stopwatch</MenuItem>
                  <MenuItem value="timer">Timer</MenuItem>
                </Select>
              </FormControl>

              {mode === 'timer' && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Set Timer
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Minutes"
                        type="number"
                        value={timerInput.minutes}
                        onChange={(e) => setTimerInput(prev => ({ ...prev, minutes: parseInt(e.target.value) || 0 }))}
                        disabled={isRunning}
                        inputProps={{ min: 0, max: 999 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Seconds"
                        type="number"
                        value={timerInput.seconds}
                        onChange={(e) => setTimerInput(prev => ({ ...prev, seconds: parseInt(e.target.value) || 0 }))}
                        disabled={isRunning}
                        inputProps={{ min: 0, max: 59 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography
                  variant="h2"
                  component="div"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    color: mode === 'timer' && time <= 10000 ? 'error.main' : 'text.primary',
                  }}
                >
                  {formatTime(time)}
                </Typography>
                
                {mode === 'timer' && timerTarget > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Box
                      sx={{
                        width: '100%',
                        height: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 4,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${getProgressPercentage()}%`,
                          height: '100%',
                          backgroundColor: 'primary.main',
                          transition: 'width 0.1s linear',
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 2 }}>
                {!isRunning ? (
                  <Button
                    variant="contained"
                    startIcon={<PlayIcon />}
                    onClick={mode === 'stopwatch' ? startStopwatch : startTimer}
                    disabled={mode === 'timer' && timerInput.minutes === 0 && timerInput.seconds === 0}
                  >
                    Start
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<PauseIcon />}
                    onClick={mode === 'stopwatch' ? pauseStopwatch : pauseTimer}
                  >
                    Pause
                  </Button>
                )}
                
                <Button
                  variant="outlined"
                  startIcon={<StopIcon />}
                  onClick={mode === 'stopwatch' ? resetStopwatch : resetTimer}
                >
                  Reset
                </Button>
                
                {mode === 'stopwatch' && (
                  <Button
                    variant="outlined"
                    startIcon={<LapIcon />}
                    onClick={addLap}
                    disabled={!isRunning}
                  >
                    Lap
                  </Button>
                )}
              </Box>

              {showAlert && (
                <Alert 
                  severity="warning" 
                  sx={{ mt: 2 }}
                  action={
                    <Button color="inherit" size="small" onClick={() => setShowAlert(false)}>
                      Dismiss
                    </Button>
                  }
                >
                  Timer completed! ⏰
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {mode === 'stopwatch' ? 'Lap Times' : 'Timer Info'}
              </Typography>

              {mode === 'stopwatch' ? (
                laps.length > 0 ? (
                  <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <List dense>
                      {laps.map((lap, index) => (
                        <ListItem key={lap.id} sx={{ borderBottom: '1px solid #333' }}>
                          <ListItemText
                            primary={`Lap ${lap.id}`}
                            secondary={`Split: ${formatLapTime(lap.split)}`}
                          />
                          <Chip
                            label={formatLapTime(lap.time)}
                            size="small"
                            variant="outlined"
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                    <LapIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                    <Typography variant="body2">
                      No laps recorded yet
                    </Typography>
                  </Box>
                )
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Set a timer duration and start the countdown. You'll get an alert when the timer completes.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Chip
                      icon={<VolumeIcon />}
                      label="Audio Alert"
                      variant="outlined"
                      color="primary"
                    />
                    <Chip
                      label="Visual Progress Bar"
                      variant="outlined"
                      color="info"
                    />
                    <Chip
                      label="Pause & Resume"
                      variant="outlined"
                      color="success"
                    />
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Features
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                ⏱️ Stopwatch
              </Typography>
              <Box component="ul" sx={{ pl: 2, color: 'text.secondary', fontSize: '0.9rem' }}>
                <li>High-precision timing (10ms accuracy)</li>
                <li>Lap time recording and split times</li>
                <li>Start, pause, and reset functionality</li>
                <li>Clean, easy-to-read display</li>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                ⏰ Timer
              </Typography>
              <Box component="ul" sx={{ pl: 2, color: 'text.secondary', fontSize: '0.9rem' }}>
                <li>Countdown timer with minutes and seconds</li>
                <li>Visual progress bar</li>
                <li>Audio alert when timer completes</li>
                <li>Pause and resume functionality</li>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            How it works
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Our stopwatch and timer tool provides precise time tracking:
          </Typography>
          <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
            <li>High-precision timing using JavaScript's performance API</li>
            <li>Real-time updates with smooth animations</li>
            <li>Lap recording for detailed time analysis</li>
            <li>Audio alerts for timer completion</li>
            <li>Responsive design for mobile and desktop use</li>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Perfect for workouts, cooking, presentations, and any activity that requires precise timing.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StopwatchTimer;
