import React, { useState, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  LinearProgress,
  Grid,
  Paper,
  Chip,
  Slider,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

interface ConvertedImage {
  originalFile: File;
  dataUrl: string;
  blob: Blob;
  originalSize: number;
  convertedSize: number;
}

const JpgToPng: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [convertedImage, setConvertedImage] = useState<ConvertedImage | null>(null);
  const [quality, setQuality] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    setImageFile(file);
    setError('');
    setSuccess('');
    setConvertedImage(null);
  };

  const convertToPng = async () => {
    if (!imageFile) {
      setError('Please upload an image file first.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      
      // Create image element
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = URL.createObjectURL(imageFile);
      });

      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0);
      
      // Convert to PNG blob
      canvas.toBlob((blob) => {
        if (blob) {
          const dataUrl = canvas.toDataURL('image/png', quality);
          const converted: ConvertedImage = {
            originalFile: imageFile,
            dataUrl,
            blob,
            originalSize: imageFile.size,
            convertedSize: blob.size,
          };
          
          setConvertedImage(converted);
          setSuccess('Image converted to PNG successfully!');
        } else {
          setError('Failed to convert image to PNG.');
        }
      }, 'image/png', quality);
      
      URL.revokeObjectURL(img.src);
    } catch (err) {
      setError('Failed to convert image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPng = () => {
    if (!convertedImage) return;
    
    const link = document.createElement('a');
    link.href = convertedImage.dataUrl;
    link.download = `${imageFile!.name.replace(/\.[^/.]+$/, '')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    setImageFile(null);
    setError('');
    setSuccess('');
    setConvertedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileSize = (bytes: number): string => {
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
          JPG to PNG Converter
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Convert JPG images to PNG format with customizable quality settings. 
          PNG format supports transparency and is lossless.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Upload Image
              </Typography>

              <Box
                sx={{
                  border: '2px dashed #666',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  mb: 3,
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {imageFile ? imageFile.name : 'Click to upload image'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {imageFile ? `Size: ${getFileSize(imageFile.size)}` : 'Drag and drop or click to select'}
                </Typography>
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              {imageFile && (
                <Box sx={{ mb: 3 }}>
                  <Chip
                    label={`Type: ${imageFile.type}`}
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`Size: ${getFileSize(imageFile.size)}`}
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Conversion Settings
              </Typography>

              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                PNG Quality: {Math.round(quality * 100)}%
              </Typography>
              <Slider
                value={quality}
                onChange={(_, value) => setQuality(value as number)}
                min={0.1}
                max={1}
                step={0.1}
                marks
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
              />

              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                PNG is a lossless format, so quality settings mainly affect file size. 
                Higher quality = larger file size.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="contained"
                  startIcon={<ImageIcon />}
                  onClick={convertToPng}
                  disabled={!imageFile || isProcessing}
                  sx={{ flex: 1 }}
                >
                  {isProcessing ? 'Converting...' : 'Convert to PNG'}
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
      </Grid>

      {isProcessing && (
        <Card sx={{ mt: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Converting Image...
            </Typography>
            <LinearProgress />
          </CardContent>
        </Card>
      )}

      {convertedImage && (
        <Card sx={{ mt: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Conversion Result
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Original Image
                  </Typography>
                  <img
                    src={URL.createObjectURL(convertedImage.originalFile)}
                    alt="Original"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '300px',
                      objectFit: 'contain',
                      borderRadius: '4px',
                      marginBottom: '8px',
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Size: {getFileSize(convertedImage.originalSize)}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                    Converted PNG
                  </Typography>
                  <img
                    src={convertedImage.dataUrl}
                    alt="Converted"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '300px',
                      objectFit: 'contain',
                      borderRadius: '4px',
                      marginBottom: '8px',
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Size: {getFileSize(convertedImage.convertedSize)}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={downloadPng}
                    fullWidth
                  >
                    Download PNG
                  </Button>
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                File Size Comparison:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Original: {getFileSize(convertedImage.originalSize)} → PNG: {getFileSize(convertedImage.convertedSize)}
                {convertedImage.convertedSize > convertedImage.originalSize ? 
                  ` (+${getFileSize(convertedImage.convertedSize - convertedImage.originalSize)})` : 
                  ` (-${getFileSize(convertedImage.originalSize - convertedImage.convertedSize)})`
                }
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

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
            About PNG Format
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Advantages:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Lossless compression<br />
                • Supports transparency<br />
                • Better for graphics and screenshots<br />
                • No quality degradation
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Best For:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Graphics and logos<br />
                • Screenshots<br />
                • Images with transparency<br />
                • When quality is priority over file size
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default JpgToPng;
