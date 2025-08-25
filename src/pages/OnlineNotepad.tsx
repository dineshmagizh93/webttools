import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Grid,
  Paper,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  AutoFixHigh as AutoSaveIcon,
} from '@mui/icons-material';

const OnlineNotepad: React.FC = () => {
  const [notes, setNotes] = useState<string>('');
  const [title, setTitle] = useState<string>('Untitled Note');
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [showStats, setShowStats] = useState<boolean>(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('online-notepad-notes');
    const savedTitle = localStorage.getItem('online-notepad-title');
    
    if (savedNotes) {
      setNotes(savedNotes);
    }
    if (savedTitle) {
      setTitle(savedTitle);
    }
    
    const savedTime = localStorage.getItem('online-notepad-last-saved');
    if (savedTime) {
      setLastSaved(new Date(savedTime));
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && notes) {
      const timeoutId = setTimeout(() => {
        saveToLocalStorage();
      }, 1000); // Save after 1 second of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [notes, autoSave]);

  const saveToLocalStorage = () => {
    try {
      localStorage.setItem('online-notepad-notes', notes);
      localStorage.setItem('online-notepad-title', title);
      localStorage.setItem('online-notepad-last-saved', new Date().toISOString());
      setLastSaved(new Date());
      setSuccess('Notes saved automatically!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to save notes. Please check your browser storage.');
    }
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotes(event.target.value);
    setError('');
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError('');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(notes);
      setSuccess('Notes copied to clipboard!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to copy to clipboard. Please copy manually.');
    }
  };

  const clearNotes = () => {
    setNotes('');
    setTitle('Untitled Note');
    setLastSaved(null);
    localStorage.removeItem('online-notepad-notes');
    localStorage.removeItem('online-notepad-title');
    localStorage.removeItem('online-notepad-last-saved');
    setSuccess('Notes cleared!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const downloadNotes = () => {
    if (!notes.trim()) {
      setError('No notes to download.');
      return;
    }

    const content = `Title: ${title}\n\n${notes}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setSuccess('Notes downloaded successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const getTextStats = () => {
    const words = notes.trim() ? notes.trim().split(/\s+/).length : 0;
    const characters = notes.length;
    const charactersNoSpaces = notes.replace(/\s/g, '').length;
    const lines = notes.split('\n').length;
    const paragraphs = notes.split(/\n\s*\n/).filter(p => p.trim()).length;
    
    return { words, characters, charactersNoSpaces, lines, paragraphs };
  };

  const stats = getTextStats();

  const sampleText = `Welcome to your online notepad!

This is a distraction-free writing environment where you can:
• Write notes, ideas, or thoughts
• Auto-save your work to browser storage
• Copy content to clipboard
• Download as text file
• Track writing statistics

Your notes are automatically saved to your browser's local storage, so they'll persist between sessions.

Happy writing! ✍️`;

  const loadSample = () => {
    setNotes(sampleText);
    setTitle('Sample Note');
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Online Notepad
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          A distraction-free writing environment with auto-save functionality. Your notes are automatically saved to your browser's local storage.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Writing Area
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={loadSample}
                  >
                    Sample
                  </Button>
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Note Title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter note title..."
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                multiline
                rows={20}
                value={notes}
                onChange={handleNotesChange}
                placeholder="Start writing your notes here..."
                variant="outlined"
                sx={{ mb: 3 }}
                InputProps={{
                  style: {
                    fontSize: '16px',
                    lineHeight: '1.6',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  }
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={saveToLocalStorage}
                  disabled={!notes.trim()}
                  sx={{ flex: 1 }}
                >
                  Save Now
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CopyIcon />}
                  onClick={copyToClipboard}
                  disabled={!notes.trim()}
                  sx={{ flex: 1 }}
                >
                  Copy
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={downloadNotes}
                  disabled={!notes.trim()}
                  sx={{ flex: 1 }}
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearNotes}
                  sx={{ flex: 1 }}
                >
                  Clear All
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Settings & Statistics
              </Typography>

              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Auto-save"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Automatically save notes after 1 second of inactivity
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={showStats}
                      onChange={(e) => setShowStats(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Show statistics"
                />
              </Box>

              {lastSaved && (
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Last Saved:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {lastSaved.toLocaleString()}
                  </Typography>
                </Paper>
              )}

              {showStats && (
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Writing Statistics:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Words:</strong> {stats.words}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Characters:</strong> {stats.characters}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>No Spaces:</strong> {stats.charactersNoSpaces}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Lines:</strong> {stats.lines}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Paragraphs:</strong> {stats.paragraphs}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Reading Time:</strong> ~{Math.ceil(stats.words / 200)} min
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Storage Info:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • Notes saved to browser localStorage
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  • Data persists between sessions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Clear browser data to remove notes
                </Typography>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mt: 4 }}>
          {success}
        </Alert>
      )}

      <Card sx={{ mt: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Features & Tips
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Features:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Distraction-free writing environment<br />
                • Auto-save to browser storage<br />
                • Copy to clipboard functionality<br />
                • Download as text file<br />
                • Real-time writing statistics<br />
                • Custom note titles
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Tips:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Enable auto-save for automatic backup<br />
                • Use descriptive titles for better organization<br />
                • Download important notes as backup<br />
                • Notes are stored locally in your browser<br />
                • Clear browser data to remove all notes
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default OnlineNotepad;


