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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Clear as ClearIcon,
  Preview as PreviewIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import html2pdf from 'html2pdf.js';

interface PdfOptions {
  margin: number;
  filename: string;
  image: { type: string; quality: number };
  html2canvas: { scale: number; useCORS: boolean };
  jsPDF: { unit: string; format: string; orientation: string };
}

const HtmlToPdf: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [pdfOptions, setPdfOptions] = useState<PdfOptions>({
    margin: 10,
    filename: 'document.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  });
  const previewRef = useRef<HTMLDivElement>(null);

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
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Sample Document</h1>
    <p>This is a sample HTML document that will be converted to PDF.</p>
  </div>
  
  <div class="content">
    <h2>Introduction</h2>
    <p>This tool allows you to convert HTML content to PDF format. You can use any HTML, CSS, and even JavaScript to create rich documents.</p>
    
    <h2>Features</h2>
    <ul>
      <li>Custom styling with CSS</li>
      <li>Tables and lists</li>
      <li>Images and graphics</li>
      <li>Professional formatting</li>
    </ul>
    
    <h2>Sample Table</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td>john@example.com</td>
          <td>Developer</td>
        </tr>
        <tr>
          <td>Jane Smith</td>
          <td>jane@example.com</td>
          <td>Designer</td>
        </tr>
      </tbody>
    </table>
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
      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '-9999px';
      document.body.appendChild(element);

      const opt = {
        margin: pdfOptions.margin,
        filename: pdfOptions.filename,
        image: pdfOptions.image,
        html2canvas: pdfOptions.html2canvas,
        jsPDF: pdfOptions.jsPDF
      };

      await html2pdf().set(opt).from(element).save();
      
      document.body.removeChild(element);
      setSuccess('PDF generated and downloaded successfully!');
    } catch (err) {
      setError('Failed to generate PDF. Please check your HTML content and try again.');
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
                  ref={previewRef}
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
                value={pdfOptions.filename}
                onChange={(e) => setPdfOptions({ ...pdfOptions, filename: e.target.value })}
                sx={{ mb: 3 }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Page Format</InputLabel>
                <Select
                  value={pdfOptions.jsPDF.format}
                  onChange={(e) => setPdfOptions({
                    ...pdfOptions,
                    jsPDF: { ...pdfOptions.jsPDF, format: e.target.value }
                  })}
                  label="Page Format"
                >
                  <MenuItem value="a4">A4</MenuItem>
                  <MenuItem value="a3">A3</MenuItem>
                  <MenuItem value="letter">Letter</MenuItem>
                  <MenuItem value="legal">Legal</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Orientation</InputLabel>
                <Select
                  value={pdfOptions.jsPDF.orientation}
                  onChange={(e) => setPdfOptions({
                    ...pdfOptions,
                    jsPDF: { ...pdfOptions.jsPDF, orientation: e.target.value }
                  })}
                  label="Orientation"
                >
                  <MenuItem value="portrait">Portrait</MenuItem>
                  <MenuItem value="landscape">Landscape</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Margin: {pdfOptions.margin}mm
              </Typography>
              <Slider
                value={pdfOptions.margin}
                onChange={(_, value) => setPdfOptions({ ...pdfOptions, margin: value as number })}
                min={0}
                max={50}
                step={5}
                marks
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Scale: {pdfOptions.html2canvas.scale}x
              </Typography>
              <Slider
                value={pdfOptions.html2canvas.scale}
                onChange={(_, value) => setPdfOptions({
                  ...pdfOptions,
                  html2canvas: { ...pdfOptions.html2canvas, scale: value as number }
                })}
                min={1}
                max={4}
                step={0.5}
                marks
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={pdfOptions.html2canvas.useCORS}
                    onChange={(e) => setPdfOptions({
                      ...pdfOptions,
                      html2canvas: { ...pdfOptions.html2canvas, useCORS: e.target.checked }
                    })}
                  />
                }
                label="Enable CORS for images"
                sx={{ mb: 2 }}
              />
            </CardContent>
          </Card>

          <Card sx={{ mt: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Tips
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Use inline CSS for better compatibility<br />
                • Keep images under 2MB for faster processing<br />
                • Test with the preview before converting<br />
                • Use relative units (%, em) for responsive layouts
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • External fonts may not render correctly<br />
                • Complex JavaScript might not work<br />
                • Some CSS properties may be ignored
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {isProcessing && (
        <Card sx={{ mt: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Generating PDF...
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
    </Container>
  );
};

export default HtmlToPdf;
