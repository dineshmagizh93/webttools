import React, { useState, useRef } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  LinearProgress,
  Alert,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  KeyboardArrowUp as UpIcon,
  KeyboardArrowDown as DownIcon,
} from '@mui/icons-material';
import html2pdf from 'html2pdf.js';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

const JpgToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && (file.type === 'image/jpeg' || file.type === 'image/png')
    );

    if (validFiles.length === 0) {
      setError('Please select valid JPG or PNG image files');
      return;
    }

    const newImages: ImageFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages(prev => [...prev, ...newImages]);
    setError('');
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && (file.type === 'image/jpeg' || file.type === 'image/png')
    );

    if (validFiles.length === 0) {
      setError('Please drop valid JPG or PNG image files');
      return;
    }

    const newImages: ImageFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages(prev => [...prev, ...newImages]);
    setError('');
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  };

  const moveImage = (id: string, direction: 'up' | 'down') => {
    setImages(prev => {
      const index = prev.findIndex(img => img.id === id);
      if (index === -1) return prev;

      const newImages = [...prev];
      if (direction === 'up' && index > 0) {
        [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
      } else if (direction === 'down' && index < newImages.length - 1) {
        [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      }
      return newImages;
    });
  };

  const convertToPdf = async () => {
    if (images.length === 0) return;

    setLoading(true);
    setError('');

    try {
      // Create a temporary container for the images
      const container = document.createElement('div');
      container.style.padding = '20px';
      container.style.backgroundColor = 'white';
      container.style.color = 'black';

      images.forEach((image, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = image.preview;
        imgElement.style.width = '100%';
        imgElement.style.maxWidth = '800px';
        imgElement.style.height = 'auto';
        imgElement.style.display = 'block';
        imgElement.style.margin = '0 auto';
        imgElement.style.pageBreakAfter = index < images.length - 1 ? 'always' : 'auto';
        container.appendChild(imgElement);
      });

      document.body.appendChild(container);

      const opt = {
        margin: 10,
        filename: 'converted_images.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(container).save();

      document.body.removeChild(container);
    } catch (err) {
      setError('Failed to convert images to PDF. Please try again.');
      console.error('PDF conversion error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    images.forEach(image => URL.revokeObjectURL(image.preview));
    setImages([]);
    setError('');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = images.reduce((sum, image) => sum + image.file.size, 0);

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          JPG to PDF Converter
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Convert multiple JPG or PNG images to a single PDF document. 
          Drag and drop to reorder pages before conversion.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ImageIcon color="primary" />
                Upload Images
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
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  ref={fileInputRef}
                  accept="image/jpeg,image/png"
                  style={{ display: 'none' }}
                  id="image-upload"
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                />
                <label htmlFor="image-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Choose Images
                  </Button>
                </label>
                
                <Typography variant="body2" color="text.secondary">
                  or drag and drop JPG/PNG files here
                </Typography>
              </Box>

              {images.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total: {images.length} images ({formatFileSize(totalSize)})
                  </Typography>
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Image Order
              </Typography>
              
              {loading && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Converting to PDF...
                  </Typography>
                </Box>
              )}

              {images.length > 0 ? (
                <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <List dense>
                    {images.map((image, index) => (
                      <ListItem key={image.id} sx={{ borderBottom: '1px solid #333' }}>
                        <Box sx={{ width: 60, height: 40, mr: 2, flexShrink: 0 }}>
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: 4,
                            }}
                          />
                        </Box>
                        <ListItemText
                          primary={`Page ${index + 1}`}
                          secondary={`${image.file.name} (${formatFileSize(image.file.size)})`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            onClick={() => moveImage(image.id, 'up')}
                            disabled={index === 0}
                          >
                            <UpIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => moveImage(image.id, 'down')}
                            disabled={index === images.length - 1}
                          >
                            <DownIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => removeImage(image.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <ImageIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                  <Typography variant="body2">
                    No images uploaded yet
                  </Typography>
                </Box>
              )}

              {images.length > 0 && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<DownloadIcon />}
                  onClick={convertToPdf}
                  disabled={loading}
                  fullWidth
                  sx={{ mt: 2, mb: 2 }}
                >
                  {loading ? 'Converting...' : 'Convert to PDF'}
                </Button>
              )}

              {images.length > 0 && (
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
            Our JPG to PDF converter creates a professional PDF document from your images:
          </Typography>
          <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
            <li>Upload multiple JPG or PNG images</li>
            <li>Drag and drop to reorder pages</li>
            <li>Each image becomes a separate page in the PDF</li>
            <li>High-quality conversion with optimal compression</li>
            <li>Download the final PDF instantly</li>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            All processing happens in your browser - your images are never uploaded to our servers.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default JpgToPdf;
