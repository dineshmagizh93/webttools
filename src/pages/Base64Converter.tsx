import React, { useState } from 'react';
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
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import {
  Copy as CopyIcon,
  Clear as ClearIcon,
  SwapHoriz as SwapIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

const Base64Converter: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [isEncoding, setIsEncoding] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const encodeToBase64 = (text: string): string => {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch (err) {
      throw new Error('Failed to encode text to Base64');
    }
  };

  const decodeFromBase64 = (base64: string): string => {
    try {
      return decodeURIComponent(escape(atob(base64)));
    } catch (err) {
      throw new Error('Invalid Base64 string');
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputText(value);
    setError('');
    setSuccess('');
    
    if (value.trim()) {
      try {
        if (isEncoding) {
          const encoded = encodeToBase64(value);
          setOutputText(encoded);
        } else {
          const decoded = decodeFromBase64(value);
          setOutputText(decoded);
        }
      } catch (err) {
        setError((err as Error).message);
        setOutputText('');
      }
    } else {
      setOutputText('');
    }
  };

  const toggleMode = () => {
    setIsEncoding(!isEncoding);
    setInputText('');
    setOutputText('');
    setError('');
    setSuccess('');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess(`${isEncoding ? 'Encoded' : 'Decoded'} text copied to clipboard!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to copy to clipboard. Please copy manually.');
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setError('');
    setSuccess('');
  };

  const downloadText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    if (isEncoding) {
      setInputText('Hello, World! This is a sample text for Base64 encoding.');
    } else {
      setInputText('SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgc2FtcGxlIHRleHQgZm9yIEJhc2U2NCBlbmNvZGluZy4=');
    }
    setError('');
    setSuccess('');
  };

  const getTextStats = (text: string) => {
    return {
      characters: text.length,
      bytes: new Blob([text]).size,
      lines: text.split('\n').length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
    };
  };

  const inputStats = getTextStats(inputText);
  const outputStats = getTextStats(outputText);

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Base64 Encoder / Decoder
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Encode text to Base64 format or decode Base64 strings back to readable text. Supports Unicode characters and large text files.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {isEncoding ? 'Input Text' : 'Base64 Input'}
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
                multiline
                rows={12}
                value={inputText}
                onChange={handleInputChange}
                placeholder={isEncoding ? 
                  "Enter text to encode to Base64..." : 
                  "Enter Base64 string to decode..."
                }
                variant="outlined"
                sx={{ mb: 3 }}
              />

              {inputText && (
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Input Statistics:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Characters:</strong> {inputStats.characters}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Bytes:</strong> {inputStats.bytes}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Lines:</strong> {inputStats.lines}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Words:</strong> {inputStats.words}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearAll}
                  sx={{ flex: 1 }}
                >
                  Clear All
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {isEncoding ? 'Base64 Output' : 'Decoded Text'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Copy to clipboard">
                    <IconButton
                      size="small"
                      onClick={() => copyToClipboard(outputText)}
                      disabled={!outputText}
                    >
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Download as file">
                    <IconButton
                      size="small"
                      onClick={() => downloadText(
                        outputText, 
                        isEncoding ? 'encoded.txt' : 'decoded.txt'
                      )}
                      disabled={!outputText}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={12}
                value={outputText}
                InputProps={{ readOnly: true }}
                placeholder={isEncoding ? 
                  "Encoded Base64 will appear here..." : 
                  "Decoded text will appear here..."
                }
                variant="outlined"
                sx={{ mb: 3 }}
              />

              {outputText && (
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Output Statistics:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Characters:</strong> {outputStats.characters}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Bytes:</strong> {outputStats.bytes}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Lines:</strong> {outputStats.lines}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Words:</strong> {outputStats.words}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Conversion Info:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isEncoding ? 
                    `Input size: ${inputStats.bytes} bytes → Output size: ${outputStats.bytes} bytes` :
                    `Input size: ${inputStats.bytes} bytes → Output size: ${outputStats.bytes} bytes`
                  }
                </Typography>
                {isEncoding && inputStats.bytes > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Size increase: {Math.round(((outputStats.bytes - inputStats.bytes) / inputStats.bytes) * 100)}%
                  </Typography>
                )}
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Mode Selection
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isEncoding}
                  onChange={toggleMode}
                  color="primary"
                />
              }
              label={isEncoding ? 'Encoding Mode' : 'Decoding Mode'}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Chip
              label="Text"
              color={isEncoding ? 'primary' : 'default'}
              variant={isEncoding ? 'filled' : 'outlined'}
            />
            <SwapIcon />
            <Chip
              label="Base64"
              color={!isEncoding ? 'primary' : 'default'}
              variant={!isEncoding ? 'filled' : 'outlined'}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            {isEncoding ? 
              'Enter text in the left panel to encode it to Base64 format. The encoded result will appear in the right panel.' :
              'Enter a Base64 string in the left panel to decode it back to readable text. The decoded result will appear in the right panel.'
            }
          </Typography>
        </CardContent>
      </Card>

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
            About Base64 Encoding
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                What is Base64?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format. 
                It's commonly used for encoding data in emails, storing complex data in JSON, and embedding binary data in URLs.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Common Uses:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Email attachments<br />
                • Data URLs in web pages<br />
                • API responses with binary data<br />
                • Storing images in databases<br />
                • Encoding credentials
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Features:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Supports Unicode characters<br />
                • Real-time encoding/decoding<br />
                • File download capability<br />
                • Copy to clipboard<br />
                • Detailed statistics
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Tips:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Base64 increases file size by ~33%<br />
                • Valid Base64 contains only A-Z, a-z, 0-9, +, /, and =<br />
                • The = character is used for padding<br />
                • Large files may take time to process
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Base64Converter;
