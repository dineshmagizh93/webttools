import React, { useState } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Button, Alert, Grid, Paper, TextField,
} from '@mui/material';
import { Download as DownloadIcon, Clear as ClearIcon, Preview as PreviewIcon, Code as CodeIcon } from '@mui/icons-material';

const HtmlToPdf: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [filename, setFilename] = useState<string>('document.pdf');

  const sampleHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; border-bottom: 2px solid #007bff; }
    .header { background: #f8f9fa; padding: 20px; border-radius: 5px; }
    .content { margin: 20px 0; }
    .footer { text-align: center; color: #666; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Sample Document</h1>
    <p>This is a sample HTML document that will be converted to PDF.</p>
  </div>
  
  <div class="content">
    <h2>Introduction</h2>
    <p>This tool allows you to convert HTML content to PDF format.</p>
    
    <h2>Features</h2>
    <ul>
      <li>Custom styling with CSS</li>
      <li>Tables and lists</li>
      <li>Images and graphics</li>
      <li>Professional formatting</li>
    </ul>
  </div>
  
  <div class="footer">
    <p>Generated on ${new Date().toLocaleDateString()}</p>
  </div>
</body>
</html>`;

  const handleHtmlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHtmlContent(event.target.value);
    setError('');
    setSuccess('');
  };

  const loadSample = () => {
    setHtmlContent(sampleHtml);
    setError('');
    setSuccess('');
  };

  const convertToPdf = async () => {
    if (!htmlContent.trim()) {
      setError('Please enter HTML content to convert.');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      // Create a new window with the HTML content
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        
        // Wait for content to load
        setTimeout(() => {
          newWindow.print();
          newWindow.close();
          setSuccess('PDF generation initiated! Use browser print dialog to save as PDF.');
        }, 1000);
      } else {
        setError('Please allow popups for this site to generate PDF.');
      }
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setHtmlContent('');
    setError('');
    setSuccess('');
    setShowPreview(false);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          HTML to PDF Converter
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Convert HTML content to PDF format with custom styling. Supports CSS, tables, images, and more.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  HTML Content
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CodeIcon />}
                    onClick={loadSample}
                  >
                    Load Sample
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<PreviewIcon />}
                    onClick={togglePreview}
                  >
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                </Box>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={15}
                value={htmlContent}
                onChange={handleHtmlChange}
                placeholder="Enter your HTML content here..."
                variant="outlined"
                sx={{ mb: 3 }}
              />

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={convertToPdf}
                  disabled={!htmlContent.trim() || isProcessing}
                  sx={{ flex: 1 }}
                >
                  {isProcessing ? 'Generating PDF...' : 'Convert to PDF'}
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

          {showPreview && htmlContent && (
            <Card sx={{ mt: 4 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  Preview
                </Typography>
                <Box
                  sx={{
                    border: '1px solid #333',
                    borderRadius: 2,
                    p: 3,
                    backgroundColor: 'white',
                    color: 'black',
                    minHeight: '400px',
                    overflow: 'auto',
                  }}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </CardContent>
            </Card>
          )}
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                PDF Settings
              </Typography>

              <TextField
                fullWidth
                label="Filename"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Tips:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Use inline CSS for better compatibility<br />
                  • Keep images under 2MB for faster processing<br />
                  • Test with the preview before converting<br />
                  • Use relative units (%, em) for responsive layouts
                </Typography>
              </Paper>
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
    </Container>
  );
};

export default HtmlToPdf;
