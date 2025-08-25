import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
  Alert,
  Chip,
  Grid,
  Paper,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  RemoveCircle as RemoveIcon,
  Compare as CompareIcon,
} from '@mui/icons-material';

const RemoveBackground: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setOriginalFile(file);
      setProcessedImage(null);
      setError('');
    }
  };

  const removeBackground = async () => {
    if (!originalFile) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image_file', originalFile);
      formData.append('size', 'auto');

      const response = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': process.env.REACT_APP_REMOVEBG_KEY || '',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setProcessedImage(imageUrl);
    } catch (err) {
      setError('Failed to remove background. Please check your API key and try again.');
      console.error('Background removal error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `removed_bg_${originalFile?.name || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    if (processedImage) {
      URL.revokeObjectURL(processedImage);
    }
    setOriginalFile(null);
    setProcessedImage(null);
    setError('');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Remove Background
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Remove backgrounds from images using AI-powered technology. 
          Perfect for product photos, portraits, and graphic design.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <RemoveIcon color="primary" />
                Upload Image
              </Typography>
              
              <Box
                sx={{
                  border: '2px dashed #666',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  mb: 2,
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(144, 202, 249, 0.05)',
                  },
                }}
              >
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="image-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Choose Image
                  </Button>
                </label>
                
                {originalFile && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Selected: {originalFile.name}
                    </Typography>
                    <Chip 
                      label={formatFileSize(originalFile.size)} 
                      color="primary" 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                )}
              </Box>

              {originalFile && (
                <Button
                  variant="contained"
                  onClick={removeBackground}
                  disabled={loading}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {loading ? 'Removing Background...' : 'Remove Background'}
                </Button>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Note:</strong> This tool requires a Remove.bg API key. 
                  Please add your API key to the environment variables.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CompareIcon color="primary" />
                Before & After
              </Typography>
              
              {loading && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Removing background from your image...
                  </Typography>
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Original Image
                  </Typography>
                  {originalFile ? (
                    <Box
                      sx={{
                        width: '100%',
                        height: 300,
                        border: '1px solid #333',
                        borderRadius: 2,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img
                        src={URL.createObjectURL(originalFile)}
                        alt="Original"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: 300,
                        border: '2px dashed #666',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        No image uploaded
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Background Removed
                  </Typography>
                  {processedImage ? (
                    <Box
                      sx={{
                        width: '100%',
                        height: 300,
                        border: '1px solid #333',
                        borderRadius: 2,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <img
                        src={processedImage}
                        alt="Processed"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        width: '100%',
                        height: 300,
                        border: '2px dashed #666',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Process image to see result
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>

              {processedImage && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<DownloadIcon />}
                  onClick={downloadImage}
                  fullWidth
                  sx={{ mt: 2, mb: 2 }}
                >
                  Download Image
                </Button>
              )}

              {(originalFile || processedImage) && (
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearAll}
                  fullWidth
                >
                  Clear All
                </Button>
              )}
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
            Our background removal tool uses advanced AI technology to automatically detect and remove backgrounds:
          </Typography>
          <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
            <li>AI-powered object detection and segmentation</li>
            <li>High-quality output with transparent backgrounds</li>
            <li>Support for various image formats (JPG, PNG, WebP)</li>
            <li>Automatic edge refinement for clean results</li>
            <li>Perfect for e-commerce, design, and social media</li>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            <strong>Setup Required:</strong> Add your Remove.bg API key to the environment variables 
            (REACT_APP_REMOVEBG_KEY) to use this feature.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RemoveBackground;
