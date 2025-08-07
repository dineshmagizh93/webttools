import React, { useState, useRef } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Button, Alert, Grid, Paper, TextField, IconButton, Tooltip, Chip, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import GoogleAd from '../components/GoogleAd';
import { ContentCopy as CopyIcon, Clear as ClearIcon, CloudUpload as UploadIcon, Download as DownloadIcon, CheckCircle as ValidIcon, Error as InvalidIcon, FormatIndentIncrease as FormatIcon } from '@mui/icons-material';

interface JsonValidationResult {
  isValid: boolean;
  error?: string;
  formatted?: string;
  statistics?: {
    totalKeys: number;
    maxDepth: number;
    totalElements: number;
  };
}

const JsonFormatter: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [validationResult, setValidationResult] = useState<JsonValidationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateStatistics = (obj: any, depth: number = 0): { totalKeys: number; maxDepth: number; totalElements: number } => {
    let totalKeys = 0;
    let maxDepth = depth;
    let totalElements = 0;

    if (Array.isArray(obj)) {
      totalElements = obj.length;
      obj.forEach((item, index) => {
        totalKeys++;
        if (typeof item === 'object' && item !== null) {
          const subStats = calculateStatistics(item, depth + 1);
          totalKeys += subStats.totalKeys;
          maxDepth = Math.max(maxDepth, subStats.maxDepth);
        }
      });
    } else if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach(key => {
        totalKeys++;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          const subStats = calculateStatistics(obj[key], depth + 1);
          totalKeys += subStats.totalKeys;
          maxDepth = Math.max(maxDepth, subStats.maxDepth);
        }
      });
    }

    return { totalKeys, maxDepth, totalElements };
  };

  const validateAndFormatJson = (input: string): JsonValidationResult => {
    if (!input.trim()) {
      return { isValid: false, error: 'Please enter JSON content' };
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      const statistics = calculateStatistics(parsed);
      return { isValid: true, formatted, statistics };
    } catch (err) {
      return { isValid: false, error: (err as Error).message };
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setJsonInput(value);
    setError('');
    setSuccess('');
    
    if (value.trim()) {
      const result = validateAndFormatJson(value);
      setValidationResult(result);
    } else {
      setValidationResult(null);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setError('Please select a valid JSON file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonInput(content);
      const result = validateAndFormatJson(content);
      setValidationResult(result);
      setError('');
      setSuccess('');
    };
    reader.onerror = () => {
      setError('Failed to read the file.');
    };
    reader.readAsText(file);
  };

  const formatJson = () => {
    if (!jsonInput.trim()) {
      setError('Please enter JSON content to format.');
      return;
    }

    const result = validateAndFormatJson(jsonInput);
    if (result.isValid && result.formatted) {
      setJsonInput(result.formatted);
      setSuccess('JSON formatted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Invalid JSON format.');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('JSON copied to clipboard!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to copy to clipboard. Please copy manually.');
    }
  };

  const downloadJson = () => {
    if (!validationResult?.isValid || !validationResult.formatted) {
      setError('No valid JSON to download.');
      return;
    }

    const blob = new Blob([validationResult.formatted], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setSuccess('JSON file downloaded successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const clearAll = () => {
    setJsonInput('');
    setValidationResult(null);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
            <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
              JSON Formatter & Viewer
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              Format, validate, and beautify JSON data. Upload JSON files or paste content directly.
            </Typography>
          </Box>

          {/* Top Banner Ad */}
          <GoogleAd adSlot="json_formatter_top" adFormat="banner" />

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  JSON Input
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<UploadIcon />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload File
                  </Button>
                </Box>
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              <TextField
                fullWidth
                multiline
                rows={20}
                value={jsonInput}
                onChange={handleInputChange}
                placeholder="Paste your JSON here or upload a file..."
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Indentation Size</InputLabel>
                <Select
                  value={indentSize}
                  onChange={(e) => setIndentSize(e.target.value as number)}
                  label="Indentation Size"
                >
                  <MenuItem value={2}>2 spaces</MenuItem>
                  <MenuItem value={4}>4 spaces</MenuItem>
                  <MenuItem value={8}>8 spaces</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="contained"
                  startIcon={<FormatIcon />}
                  onClick={formatJson}
                  disabled={!jsonInput.trim()}
                  sx={{ flex: 1 }}
                >
                  Format JSON
                </Button>
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
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Validation & Output
              </Typography>

              {validationResult ? (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {validationResult.isValid ? (
                      <ValidIcon color="success" sx={{ mr: 1 }} />
                    ) : (
                      <InvalidIcon color="error" sx={{ mr: 1 }} />
                    )}
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {validationResult.isValid ? 'Valid JSON' : 'Invalid JSON'}
                    </Typography>
                  </Box>

                  {validationResult.isValid && validationResult.statistics && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        Statistics:
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={`${validationResult.statistics.totalKeys} keys`}
                          color="primary"
                          size="small"
                        />
                        <Chip
                          label={`Depth: ${validationResult.statistics.maxDepth}`}
                          color="secondary"
                          size="small"
                        />
                        {validationResult.statistics.totalElements > 0 && (
                          <Chip
                            label={`${validationResult.statistics.totalElements} elements`}
                            color="info"
                            size="small"
                          />
                        )}
                      </Box>
                    </Box>
                  )}

                  {validationResult.isValid && validationResult.formatted && (
                    <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, mb: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Formatted JSON:
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Copy formatted JSON">
                            <IconButton
                              size="small"
                              onClick={() => copyToClipboard(validationResult.formatted!)}
                            >
                              <CopyIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download JSON file">
                            <IconButton
                              size="small"
                              onClick={downloadJson}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                      <Box
                        component="pre"
                        sx={{
                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                          p: 2,
                          borderRadius: 1,
                          fontSize: '0.875rem',
                          overflow: 'auto',
                          maxHeight: '400px',
                          fontFamily: 'monospace',
                          color: '#90caf9',
                        }}
                      >
                        {validationResult.formatted}
                      </Box>
                    </Paper>
                  )}

                  {!validationResult.isValid && validationResult.error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      <Typography variant="body2">
                        <strong>Error:</strong> {validationResult.error}
                      </Typography>
                    </Alert>
                  )}
                </Box>
              ) : (
                <Paper sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Enter JSON content to see validation and formatting results
                  </Typography>
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
            JSON Formatting Tips
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Valid JSON Structure:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Use double quotes for strings<br />
                • Separate key-value pairs with commas<br />
                • No trailing commas allowed<br />
                • Proper nesting of brackets and braces
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Common Issues:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Missing quotes around property names<br />
                • Single quotes instead of double quotes<br />
                • Trailing commas in objects/arrays<br />
                • Unescaped special characters
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
                </Card>

          {/* Bottom Banner Ad */}
          <GoogleAd adSlot="json_formatter_bottom" adFormat="banner" />
        </Container>
      );
    };

export default JsonFormatter;
