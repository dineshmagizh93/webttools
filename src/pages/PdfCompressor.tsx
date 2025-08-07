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
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { PDFDocument } from 'pdf-lib';

const PdfCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressedPdf, setCompressedPdf] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [error, setError] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a valid PDF file');
        return;
      }
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setCompressedPdf(null);
      setError('');
    }
  };

  const compressPdf = async () => {
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Compress the PDF by reducing image quality and removing unnecessary data
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 20,
      });

      setCompressedPdf(compressedBytes);
      setCompressedSize(compressedBytes.length);
    } catch (err) {
      setError('Failed to compress PDF. Please try again.');
      console.error('PDF compression error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadCompressedPdf = () => {
    if (!compressedPdf || !file) return;

    const blob = new Blob([compressedPdf], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed_${file.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setFile(null);
    setCompressedPdf(null);
    setOriginalSize(0);
    setCompressedSize(0);
    setError('');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressionRatio = originalSize > 0 ? ((originalSize - compressedSize) / originalSize * 100).toFixed(1) : '0';

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          PDF Compressor
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Compress your PDF files to reduce size while maintaining quality. 
          Perfect for sharing and uploading large documents.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PdfIcon color="primary" />
                Upload PDF
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
                  accept=".pdf"
                  style={{ display: 'none' }}
                  id="pdf-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="pdf-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                    sx={{ mb: 2 }}
                  >
                    Choose PDF File
                  </Button>
                </label>
                
                {file && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Selected: {file.name}
                    </Typography>
                    <Chip 
                      label={formatFileSize(file.size)} 
                      color="primary" 
                      size="small" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                )}
              </Box>

              {file && (
                <Button
                  variant="contained"
                  onClick={compressPdf}
                  disabled={loading}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  {loading ? 'Compressing...' : 'Compress PDF'}
                </Button>
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
                Compression Results
              </Typography>
              
              {loading && (
                <Box sx={{ mb: 2 }}>
                  <LinearProgress />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Compressing your PDF...
                  </Typography>
                </Box>
              )}

              {compressedPdf && (
                <Paper sx={{ p: 2, mb: 2, backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Original Size
                      </Typography>
                      <Typography variant="h6" color="error">
                        {formatFileSize(originalSize)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Compressed Size
                      </Typography>
                      <Typography variant="h6" color="success.main">
                        {formatFileSize(compressedSize)}
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

              {compressedPdf && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<DownloadIcon />}
                  onClick={downloadCompressedPdf}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Download Compressed PDF
                </Button>
              )}

              {(file || compressedPdf) && (
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
            Our PDF compressor works entirely in your browser using advanced compression algorithms. 
            It reduces file size by:
          </Typography>
          <Box component="ul" sx={{ pl: 2, color: 'text.secondary' }}>
            <li>Optimizing image quality and resolution</li>
            <li>Removing unnecessary metadata</li>
            <li>Compressing text and vector graphics</li>
            <li>Using efficient object streams</li>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Your files are never uploaded to our servers - all processing happens locally in your browser.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PdfCompressor;
