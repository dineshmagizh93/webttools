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
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  Compress as CompressIcon,
  Compare as CompareIcon,
} from '@mui/icons-material';
import imageCompression from 'browser-image-compression';

interface CompressedImage {
  file: File;
  originalSize: number;
  compressedSize: number;
  preview: string;
}

const ImageCompressor: React.FC = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<CompressedImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [quality, setQuality] = useState<number>(0.8);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [maxHeight, setMaxHeight] = useState<number>(1080);
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setOriginalFile(file);
      setCompressedImage(null);
      setError('');
    }
  };

  const compressImage = async () => {
    if (!originalFile) return;

    setLoading(true);
    setError('');

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: Math.max(maxWidth, maxHeight),
        useWebWorker: true,
        fileType: `image/${outputFormat}`,
        quality: quality,
      };

      const compressedFile = await imageCompression(originalFile, options);
      
      const compressedPreview = URL.createObjectURL(compressedFile);
      
      setCompressedImage({
        file: compressedFile,
        originalSize: originalFile.size,
        compressedSize: compressedFile.size,
        preview: compressedPreview,
      });
    } catch (err) {
      setError('Failed to compress image. Please try again.');
      console.error('Image compression error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCompressedImage = () => {
    if (!compressedImage) return;

    const link = document.createElement('a');
    link.href = compressedImage.preview;
    link.download = `compressed_${originalFile?.name || 'image'}.${outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearAll = () => {
    if (compressedImage) {
      URL.revokeObjectURL(compressedImage.preview);
    }
    setOriginalFile(null);
    setCompressedImage(null);
    setError('');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressionRatio = originalFile && compressedImage 
    ? ((originalFile.size - compressedImage.compressedSize) / originalFile.size * 100).toFixed(1) 
    : '0';

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Image Compressor
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Compress your images to reduce file size while maintaining quality. 
          Perfect for web optimization and faster uploads.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CompressIcon color="primary" />
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
                  onClick={compressImage}
                  disabled={loading}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {loading ? 'Compressing...' : 'Compress Image'}
                </Button>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Compression Settings
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Quality: {Math.round(quality * 100)}%
                </Typography>
                <Slider
                  value={quality}
                  onChange={(_, value) => setQuality(value as number)}
                  min={0.1}
                  max={1}
                  step={0.1}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Max Width: {maxWidth}px
                </Typography>
                <Slider
                  value={maxWidth}
                  onChange={(_, value) => setMaxWidth(value as number)}
                  min={100}
                  max={4000}
                  step={100}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Max Height: {maxHeight}px
                </Typography>
                <Slider
                  value={maxHeight}
                  onChange={(_, value) => setMaxHeight(value as number)}
                  min={100}
                  max={4000}
                  step={100}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <FormControl fullWidth>
                <InputLabel>Output Format</InputLabel>
                <Select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as 'jpeg' | 'png' | 'webp')}
                >
                  <MenuItem value="jpeg">JPEG</MenuItem>
                  <MenuItem value="png">PNG</MenuItem>
                  <MenuItem value="webp">WebP</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <CompareIcon color="primary" />
                Before & After Comparison
              </Typography>
              
              {loading && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Compressing your image...
                  </Typography>
                </Box>
              )}

              {originalFile && compressedImage && (
                <Paper sx={{ p: 2, mb: 2, backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Original Size
                      </Typography>
                      <Typography variant="h6" color="error">
                        {formatFileSize(compressedImage.originalSize)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Compressed Size
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        {formatFileSize(compressedImage.compressedSize)}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Chip 
                      label={`${compressionRatio}% smaller`}
                      color="success"
                      variant="outlined"
                    />
                  </Box>
                </Paper>
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
                    Compressed Image
                  </Typography>
                  {compressedImage ? (
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
                        src={compressedImage.preview}
                        alt="Compressed"
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
                        Compress image to see result
                      </Typography>
                    </Box>
                  )}
                </Grid>
              </Grid>

              {compressedImage && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<DownloadIcon />}
                  onClick={downloadCompressedImage}
                  fullWidth
                  sx={{ mt: 2, mb: 2 }}
                >
                  Download Compressed Image
                </Button>
              )}

              {(originalFile || compressedImage) && (
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
            Our image compressor uses advanced algorithms to reduce file size while preserving visual quality:
          </Typography>
          <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
            <li>Intelligent quality reduction based on your settings</li>
            <li>Automatic resizing to specified dimensions</li>
            <li>Format conversion to more efficient file types</li>
            <li>WebP support for maximum compression</li>
            <li>Real-time preview of compression results</li>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            All processing happens in your browser - your images are never uploaded to our servers.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ImageCompressor;
