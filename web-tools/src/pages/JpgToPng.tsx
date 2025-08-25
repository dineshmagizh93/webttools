import React, { useState, useRef } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Button, Alert, Grid, Chip, Slider,
} from '@mui/material';
import { CloudUpload as UploadIcon, Download as DownloadIcon, Clear as ClearIcon, Image as ImageIcon } from '@mui/icons-material';

const JpgToPng: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [convertedImage, setConvertedImage] = useState<string>('');
  const [quality, setQuality] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    setImageFile(file);
    setError('');
    setSuccess('');
    setConvertedImage('');
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
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = URL.createObjectURL(imageFile);
      });

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const dataUrl = canvas.toDataURL('image/png', quality);
      setConvertedImage(dataUrl);
      setSuccess('Image converted to PNG successfully!');
      
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
    link.href = convertedImage;
    link.download = `${imageFile!.name.replace(/\.[^/.]+$/, '')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    setImageFile(null);
    setError('');
    setSuccess('');
    setConvertedImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          JPG to PNG Converter
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Convert JPG images to PNG format with customizable quality settings.
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
                  {imageFile ? `Size: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB` : 'Drag and drop or click to select'}
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
                    label={`Size: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB`}
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

      {convertedImage && (
        <Card sx={{ mt: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Converted PNG
            </Typography>
            <img
              src={convertedImage}
              alt="Converted"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'contain',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
            />
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={downloadPng}
              fullWidth
            >
              Download PNG
            </Button>
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
    </Container>
  );
};

export default JpgToPng;
