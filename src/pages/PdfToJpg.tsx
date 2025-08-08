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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { PDFDocument } from 'pdf-lib';

interface ConvertedPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
}

const PdfToJpg: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [convertedPages, setConvertedPages] = useState<ConvertedPage[]>([]);
  const [quality, setQuality] = useState<number>(0.8);
  const [scale, setScale] = useState<number>(2);
  const [selectedPages, setSelectedPages] = useState<string>('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }

    setPdfFile(file);
    setError('');
    setSuccess('');
    setConvertedPages([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdfDoc.getPageCount());
    } catch (err) {
      setError('Failed to load PDF file. Please try again.');
    }
  };

  const convertPdfToImages = async () => {
    if (!pdfFile) {
      setError('Please upload a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Load pdf2pic library dynamically
      const pdf2pic = await import('pdf2pic');
      
      const options = {
        density: scale * 100, // DPI
        saveFilename: "page",
        savePath: "./output/",
        format: "jpg",
        width: 2048,
        height: 2048
      };

      const convert = pdf2pic.fromPath(pdfFile.name, options);
      
      const pagesToConvert = selectedPages === 'all' 
        ? Array.from({ length: totalPages }, (_, i) => i + 1)
        : selectedPages.split(',').map(p => parseInt(p.trim())).filter(p => p > 0 && p <= totalPages);

      const converted: ConvertedPage[] = [];

      for (const pageNum of pagesToConvert) {
        try {
          const page = pdfDoc.getPage(pageNum - 1);
          const { width, height } = page.getSize();
          
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          // Set canvas size
          canvas.width = width * scale;
          canvas.height = height * scale;
          
          // Convert PDF page to image using pdf-lib and canvas
          const pdfBytes = await PDFDocument.create();
          const [copiedPage] = await pdfBytes.copyPages(pdfDoc, [pageNum - 1]);
          pdfBytes.addPage(copiedPage);
          
          const pdfBlob = new Blob([await pdfBytes.save()], { type: 'application/pdf' });
          const pdfUrl = URL.createObjectURL(pdfBlob);
          
          // Create image from PDF
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = pdfUrl;
          });
          
          // Draw on canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convert to blob
          canvas.toBlob((blob) => {
            if (blob) {
              const dataUrl = canvas.toDataURL('image/jpeg', quality);
              converted.push({
                pageNumber: pageNum,
                dataUrl,
                blob
              });
            }
          }, 'image/jpeg', quality);
          
          URL.revokeObjectURL(pdfUrl);
        } catch (err) {
          console.error(`Error converting page ${pageNum}:`, err);
        }
      }

      setConvertedPages(converted);
      setSuccess(`Successfully converted ${converted.length} page(s) to JPG.`);
    } catch (err) {
      setError('Failed to convert PDF to images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (page: ConvertedPage) => {
    const link = document.createElement('a');
    link.href = page.dataUrl;
    link.download = `page_${page.pageNumber}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    convertedPages.forEach((page, index) => {
      setTimeout(() => {
        downloadImage(page);
      }, index * 100);
    });
  };

  const clearAll = () => {
    setPdfFile(null);
    setTotalPages(0);
    setError('');
    setSuccess('');
    setConvertedPages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          PDF to JPG Converter
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Convert PDF pages to high-quality JPG images. Choose specific pages or convert all pages at once.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Upload PDF
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
                  {pdfFile ? pdfFile.name : 'Click to upload PDF'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {pdfFile ? `Size: ${(pdfFile.size / 1024 / 1024).toFixed(2)} MB` : 'Drag and drop or click to select'}
                </Typography>
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              {pdfFile && (
                <Box sx={{ mb: 3 }}>
                  <Chip
                    label={`Total Pages: ${totalPages}`}
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={`File Size: ${(pdfFile.size / 1024 / 1024).toFixed(2)} MB`}
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

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Pages to Convert</InputLabel>
                <Select
                  value={selectedPages}
                  onChange={(e) => setSelectedPages(e.target.value)}
                  label="Pages to Convert"
                >
                  <MenuItem value="all">All Pages</MenuItem>
                  <MenuItem value="1">Page 1</MenuItem>
                  <MenuItem value="1,2">Pages 1-2</MenuItem>
                  <MenuItem value="1,2,3">Pages 1-3</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Image Quality: {Math.round(quality * 100)}%
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

              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Scale Factor: {scale}x
              </Typography>
              <Slider
                value={scale}
                onChange={(_, value) => setScale(value as number)}
                min={1}
                max={4}
                step={0.5}
                marks
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="contained"
                  startIcon={<ImageIcon />}
                  onClick={convertPdfToImages}
                  disabled={!pdfFile || isProcessing}
                  sx={{ flex: 1 }}
                >
                  {isProcessing ? 'Converting...' : 'Convert to JPG'}
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
              Converting PDF to Images...
            </Typography>
            <LinearProgress />
          </CardContent>
        </Card>
      )}

      {convertedPages.length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Converted Images ({convertedPages.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={downloadAll}
              >
                Download All
              </Button>
            </Box>

            <Grid container spacing={2}>
              {convertedPages.map((page) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={page.pageNumber}>
                  <Paper
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 2,
                    }}
                  >
                    <img
                      src={page.dataUrl}
                      alt={`Page ${page.pageNumber}`}
                      style={{
                        width: '100%',
                        height: 'auto',
                        maxHeight: '200px',
                        objectFit: 'contain',
                        borderRadius: '4px',
                        marginBottom: '8px',
                      }}
                    />
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Page {page.pageNumber}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<DownloadIcon />}
                      onClick={() => downloadImage(page)}
                      fullWidth
                    >
                      Download
                    </Button>
                  </Paper>
                </Grid>
              ))}
            </Grid>
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

export default PdfToJpg;
