import React, { useState, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  LinearProgress,
  Grid,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { PDFDocument } from 'pdf-lib';

interface PageRange {
  start: number;
  end: number;
}

const PdfSplit: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pageRanges, setPageRanges] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [parsedRanges, setParsedRanges] = useState<PageRange[]>([]);
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
    setPageRanges('');
    setParsedRanges([]);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setTotalPages(pdfDoc.getPageCount());
    } catch (err) {
      setError('Failed to load PDF file. Please try again.');
    }
  };

  const parsePageRanges = (ranges: string): PageRange[] => {
    const parsed: PageRange[] = [];
    const rangeStrings = ranges.split(',').map(s => s.trim());

    for (const rangeStr of rangeStrings) {
      if (rangeStr.includes('-')) {
        const [start, end] = rangeStr.split('-').map(s => parseInt(s.trim()));
        if (!isNaN(start) && !isNaN(end) && start > 0 && end > 0 && start <= end) {
          parsed.push({ start, end });
        }
      } else {
        const page = parseInt(rangeStr);
        if (!isNaN(page) && page > 0) {
          parsed.push({ start: page, end: page });
        }
      }
    }

    return parsed;
  };

  const handlePageRangesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPageRanges(value);
    
    if (value.trim()) {
      const ranges = parsePageRanges(value);
      setParsedRanges(ranges);
    } else {
      setParsedRanges([]);
    }
  };

  const validateRanges = (): boolean => {
    if (!pdfFile) {
      setError('Please upload a PDF file first.');
      return false;
    }

    if (!pageRanges.trim()) {
      setError('Please enter page ranges.');
      return false;
    }

    const ranges = parsePageRanges(pageRanges);
    if (ranges.length === 0) {
      setError('Invalid page range format. Use format like: 1-3, 4, 6-8');
      return false;
    }

    for (const range of ranges) {
      if (range.end > totalPages) {
        setError(`Page ${range.end} exceeds total pages (${totalPages}).`);
        return false;
      }
    }

    return true;
  };

  const splitPdf = async () => {
    if (!validateRanges()) return;

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const arrayBuffer = await pdfFile!.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdfDoc = await PDFDocument.create();

      for (const range of parsedRanges) {
        for (let i = range.start - 1; i < range.end; i++) {
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
          newPdfDoc.addPage(copiedPage);
        }
      }

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `split_${pdfFile!.name.replace('.pdf', '')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess(`PDF split successfully! Downloaded ${parsedRanges.length} range(s).`);
    } catch (err) {
      setError('Failed to split PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setPdfFile(null);
    setPageRanges('');
    setTotalPages(0);
    setError('');
    setSuccess('');
    setParsedRanges([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getSelectedPagesCount = (): number => {
    return parsedRanges.reduce((total, range) => total + (range.end - range.start + 1), 0);
  };

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          PDF Split Tool
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Upload a PDF file and specify page ranges to split it into a new document. 
          Use format like: 1-3, 4, 6-8 to select specific pages or ranges.
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
                Page Ranges
              </Typography>

              <TextField
                fullWidth
                label="Page Ranges"
                value={pageRanges}
                onChange={handlePageRangesChange}
                placeholder="e.g., 1-3, 4, 6-8"
                sx={{ mb: 3 }}
                helperText="Enter page ranges separated by commas. Use format: 1-3, 4, 6-8"
              />

              {parsedRanges.length > 0 && (
                <Paper sx={{ p: 2, mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    Selected Ranges:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {parsedRanges.map((range, index) => (
                      <Chip
                        key={index}
                        label={range.start === range.end ? `Page ${range.start}` : `Pages ${range.start}-${range.end}`}
                        color="primary"
                        size="small"
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Total pages to extract: {getSelectedPagesCount()}
                  </Typography>
                </Paper>
              )}

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={splitPdf}
                  disabled={!pdfFile || !pageRanges.trim() || isProcessing}
                  sx={{ flex: 1 }}
                >
                  {isProcessing ? 'Processing...' : 'Split PDF'}
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
              Processing PDF...
            </Typography>
            <LinearProgress />
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
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon color="primary" />
            How to Use
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Page Range Format:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Single page: 5<br />
                • Page range: 1-10<br />
                • Multiple ranges: 1-3, 5, 7-9<br />
                • Mixed format: 1-5, 8, 10-12
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Tips:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Pages are numbered starting from 1<br />
                • Ranges are inclusive (1-3 includes pages 1, 2, and 3)<br />
                • The tool processes pages in the order you specify<br />
                • All processing happens in your browser for privacy
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default PdfSplit;

