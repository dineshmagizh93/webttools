import React, { useState } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Button, Alert, Grid, Paper, TextField, IconButton, Tooltip, Switch, FormControlLabel,
} from '@mui/material';
import { ContentCopy as CopyIcon, Clear as ClearIcon, SwapHoriz as SwapIcon } from '@mui/icons-material';

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

  const handleModeToggle = () => {
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

  const swapTexts = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setError('');
    setSuccess('');
  };

  const isBase64Valid = (str: string): boolean => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  const getInputPlaceholder = (): string => {
    return isEncoding 
      ? 'Enter text to encode to Base64...' 
      : 'Enter Base64 string to decode...';
  };

  const getOutputPlaceholder = (): string => {
    return isEncoding 
      ? 'Base64 encoded result will appear here...' 
      : 'Decoded text will appear here...';
  };

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Base64 Encoder / Decoder
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Encode text to Base64 format or decode Base64 strings back to readable text. 
          Supports Unicode characters and binary data.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {isEncoding ? 'Text to Encode' : 'Base64 to Decode'}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isEncoding}
                      onChange={handleModeToggle}
                      color="primary"
                    />
                  }
                  label={isEncoding ? 'Encode' : 'Decode'}
                />
              </Box>

              <TextField
                fullWidth
                multiline
                rows={12}
                value={inputText}
                onChange={handleInputChange}
                placeholder={getInputPlaceholder()}
                variant="outlined"
                sx={{ mb: 3 }}
                error={!!error}
                helperText={error || `${isEncoding ? 'Enter' : 'Paste'} your ${isEncoding ? 'text' : 'Base64 string'} here`}
              />

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearAll}
                  sx={{ flex: 1 }}
                >
                  Clear All
                </Button>
                {inputText && outputText && (
                  <Button
                    variant="outlined"
                    startIcon={<SwapIcon />}
                    onClick={swapTexts}
                    sx={{ flex: 1 }}
                  >
                    Swap
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                {isEncoding ? 'Base64 Output' : 'Decoded Text'}
              </Typography>

              {outputText ? (
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {isEncoding ? 'Encoded Base64:' : 'Decoded Text:'}
                    </Typography>
                    <Tooltip title="Copy to clipboard">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(outputText)}
                      >
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      p: 2,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      overflow: 'auto',
                      maxHeight: '300px',
                      fontFamily: 'monospace',
                      color: '#90caf9',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-all',
                    }}
                  >
                    {outputText}
                  </Box>
                </Paper>
              ) : (
                <Paper sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    {getOutputPlaceholder()}
                  </Typography>
                </Paper>
              )}

              {inputText && (
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Input Statistics:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">
                      Length: {inputText.length} characters
                    </Typography>
                    {!isEncoding && (
                      <Typography variant="body2" color="text.secondary">
                        Valid Base64: {isBase64Valid(inputText) ? 'Yes' : 'No'}
                      </Typography>
                    )}
                    {isEncoding && (
                      <Typography variant="body2" color="text.secondary">
                        Size: {(new Blob([inputText]).size / 1024).toFixed(2)} KB
                      </Typography>
                    )}
                  </Box>
                </Paper>
              )}

              {outputText && (
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Output Statistics:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">
                      Length: {outputText.length} characters
                    </Typography>
                    {isEncoding && (
                      <Typography variant="body2" color="text.secondary">
                        Size: {(new Blob([outputText]).size / 1024).toFixed(2)} KB
                      </Typography>
                    )}
                    {!isEncoding && (
                      <Typography variant="body2" color="text.secondary">
                        Size: {(new Blob([outputText]).size / 1024).toFixed(2)} KB
                      </Typography>
                    )}
                  </Box>
                </Paper>
              )}
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
            About Base64 Encoding
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                What is Base64?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Base64 is a binary-to-text encoding scheme that represents binary data in ASCII string format. 
                It's commonly used for encoding data in URLs, email attachments, and storing binary data as text.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Common Uses:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Email attachments (MIME)<br />
                • Data URLs in web pages<br />
                • API authentication tokens<br />
                • Binary data in JSON
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Encoding Process:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Converts text to binary<br />
                • Groups bits into 6-bit chunks<br />
                • Maps each chunk to ASCII character<br />
                • Adds padding if needed (=)
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Decoding Process:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Removes padding characters<br />
                • Converts ASCII to 6-bit chunks<br />
                • Reconstructs original binary data<br />
                • Converts back to text
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Base64Converter;
