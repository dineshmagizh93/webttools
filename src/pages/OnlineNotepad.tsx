import React, { useState, useEffect, useRef } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Button, Alert, Grid, Paper, TextField, IconButton, Tooltip, Chip, Switch, FormControlLabel,
} from '@mui/material';
import { 
  ContentCopy as CopyIcon, 
  Clear as ClearIcon, 
  Download as DownloadIcon, 
  Save as SaveIcon, 
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatListBulleted as ListIcon,
  FormatListNumbered as NumberedListIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from '@mui/icons-material';

const OnlineNotepad: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [autoSave, setAutoSave] = useState<boolean>(true);
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [lastSaved, setLastSaved] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const STORAGE_KEY = 'online_notepad_content';

  // Load content from localStorage on component mount
  useEffect(() => {
    const savedContent = localStorage.getItem(STORAGE_KEY);
    if (savedContent) {
      setContent(savedContent);
      setLastSaved(new Date().toLocaleString());
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && content) {
      const saveTimeout = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, content);
        setLastSaved(new Date().toLocaleString());
      }, 1000);

      return () => clearTimeout(saveTimeout);
    }
  }, [content, autoSave]);

  // Calculate word and character count
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const chars = content.length;
    setWordCount(words);
    setCharCount(chars);
  }, [content]);

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
    setError('');
    setSuccess('');
  };

  const saveContent = () => {
    try {
      localStorage.setItem(STORAGE_KEY, content);
      setLastSaved(new Date().toLocaleString());
      setSuccess('Content saved successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save content. Please try again.');
    }
  };

  const clearContent = () => {
    setContent('');
    localStorage.removeItem(STORAGE_KEY);
    setLastSaved('');
    setError('');
    setSuccess('');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setSuccess('Content copied to clipboard!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to copy to clipboard. Please copy manually.');
    }
  };

  const downloadAsText = () => {
    if (!content.trim()) {
      setError('No content to download.');
      return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notepad_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setSuccess('File downloaded successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const formatText = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'bullet':
        formattedText = selectedText.split('\n').map(line => `• ${line}`).join('\n');
        break;
      case 'numbered':
        formattedText = selectedText.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n');
        break;
      default:
        return;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);

    // Set cursor position after formatting
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(start, start + formattedText.length);
      }
    }, 0);
  };

  const getReadingTime = (): string => {
    const wordsPerMinute = 200;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes === 1 ? '1 minute' : `${minutes} minutes`;
  };

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Online Notepad
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          A distraction-free writing environment with auto-save functionality. 
          Your content is automatically saved to your browser's local storage.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={9}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Writing Area
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Format Bold">
                    <IconButton size="small" onClick={() => formatText('bold')}>
                      <BoldIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Format Italic">
                    <IconButton size="small" onClick={() => formatText('italic')}>
                      <ItalicIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Format Underline">
                    <IconButton size="small" onClick={() => formatText('underline')}>
                      <UnderlineIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Bullet List">
                    <IconButton size="small" onClick={() => formatText('bullet')}>
                      <ListIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Numbered List">
                    <IconButton size="small" onClick={() => formatText('numbered')}>
                      <NumberedListIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
                    <IconButton size="small" onClick={toggleFullscreen}>
                      {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={isFullscreen ? 25 : 20}
                value={content}
                onChange={handleContentChange}
                placeholder="Start writing here... Your content will be automatically saved."
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'monospace',
                    fontSize: '1rem',
                    lineHeight: 1.6,
                  },
                }}
              />

              <Box sx={{ display: 'flex', gap: 2, mt: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={saveContent}
                  sx={{ flex: 1 }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CopyIcon />}
                  onClick={copyToClipboard}
                  disabled={!content.trim()}
                  sx={{ flex: 1 }}
                >
                  Copy
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={downloadAsText}
                  disabled={!content.trim()}
                  sx={{ flex: 1 }}
                >
                  Download
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearContent}
                  sx={{ flex: 1 }}
                >
                  Clear
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Settings & Stats
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
                />
                {lastSaved && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Last saved: {lastSaved}
                  </Typography>
                )}
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  Statistics:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip
                    label={`${wordCount} words`}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${charCount} characters`}
                    color="secondary"
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${getReadingTime()} read`}
                    color="info"
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    label={`${Math.ceil(content.length / 1024)} KB`}
                    color="warning"
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </Box>

              <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Quick Tips:
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  • Use **text** for bold<br />
                  • Use *text* for italic<br />
                  • Use __text__ for underline<br />
                  • Select text and use format buttons<br />
                  • Content auto-saves every second
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
            Features
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Writing Features:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Distraction-free writing environment<br />
                • Auto-save to browser storage<br />
                • Text formatting options<br />
                • Word and character count<br />
                • Reading time estimation
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Export Options:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Copy to clipboard<br />
                • Download as .txt file<br />
                • Fullscreen mode<br />
                • Local storage backup<br />
                • No account required
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default OnlineNotepad;
