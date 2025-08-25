import React, { useState, useRef } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Clear as ClearIcon,
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  CheckCircle as ValidIcon,
  Error as InvalidIcon,
  FormatIndentIncrease as FormatIcon,
} from '@mui/icons-material';

interface JsonValidationResult {
  isValid: boolean;
  error?: string;
  formatted?: string;
}

const JsonFormatter: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [validationResult, setValidationResult] = useState<JsonValidationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndFormatJson = (input: string): JsonValidationResult => {
    if (!input.trim()) {
      return { isValid: false, error: 'Please enter JSON content' };
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, indentSize);
      return { isValid: true, formatted };
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

  const getJsonStats = () => {
    if (!validationResult?.isValid) return null;
    
    try {
      const parsed = JSON.parse(jsonInput);
      const stats = {
        keys: countKeys(parsed),
        depth: getMaxDepth(parsed),
        size: jsonInput.length,
        lines: jsonInput.split('\n').length,
      };
      return stats;
    } catch {
      return null;
    }
  };

  const countKeys = (obj: any): number => {
    if (typeof obj !== 'object' || obj === null) return 0;
    if (Array.isArray(obj)) return obj.reduce((sum, item) => sum + countKeys(item), 0);
    return Object.keys(obj).length + Object.values(obj).reduce((sum, value) => sum + countKeys(value), 0);
  };

  const getMaxDepth = (obj: any, currentDepth = 1): number => {
    if (typeof obj !== 'object' || obj === null) return currentDepth;
    if (Array.isArray(obj)) {
      return Math.max(currentDepth, ...obj.map(item => getMaxDepth(item, currentDepth + 1)));
    }
    return Math.max(currentDepth, ...Object.values(obj).map(value => getMaxDepth(value, currentDepth + 1)));
  };

  const sampleJson = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "country": "USA"
  },
  "hobbies": ["reading", "swimming", "coding"],
  "active": true
}`;

  const loadSample = () => {
    setJsonInput(sampleJson);
    const result = validateAndFormatJson(sampleJson);
    setValidationResult(result);
    setError('');
    setSuccess('');
  };

  const stats = getJsonStats();

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          JSON Formatter & Viewer
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Format, validate, and beautify JSON data. Supports file upload, syntax highlighting, and detailed validation.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Input JSON
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<UploadIcon />}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={loadSample}
                  >
                    Sample
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
                rows={15}
                value={jsonInput}
                onChange={handleInputChange}
                placeholder="Paste your JSON here or upload a file..."
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Indent</InputLabel>
                  <Select
                    value={indentSize}
                    onChange={(e) => setIndentSize(e.target.value as number)}
                    label="Indent"
                  >
                    <MenuItem value={2}>2 spaces</MenuItem>
                    <MenuItem value={4}>4 spaces</MenuItem>
                    <MenuItem value={8}>8 spaces</MenuItem>
                  </Select>
                </FormControl>
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
                  Clear
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

              {validationResult && (
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    {validationResult.isValid ? (
                      <ValidIcon color="success" />
                    ) : (
                      <InvalidIcon color="error" />
                    )}
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {validationResult.isValid ? 'Valid JSON' : 'Invalid JSON'}
                    </Typography>
                  </Box>
                  
                  {validationResult.isValid ? (
                    <Box>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
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
                        }}
                      >
                        {validationResult.formatted}
                      </Box>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="error">
                      {validationResult.error}
                    </Typography>
                  )}
                </Paper>
              )}

              {stats && (
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    JSON Statistics:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Total Keys:</strong> {stats.keys}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Max Depth:</strong> {stats.depth}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Characters:</strong> {stats.size}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Lines:</strong> {stats.lines}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {!validationResult && (
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
            JSON Formatting Guide
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Features:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Real-time JSON validation<br />
                • Pretty formatting with custom indentation<br />
                • File upload support (.json files)<br />
                • Copy to clipboard functionality<br />
                • Download formatted JSON
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Tips:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Use 2 spaces for standard formatting<br />
                • 4 spaces for more readable code<br />
                • 8 spaces for minimal formatting<br />
                • Invalid JSON will show error details<br />
                • Large files may take a moment to process
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default JsonFormatter;


