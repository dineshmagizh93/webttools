import React, { useState } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Button, Alert, Grid, Paper, TextField, Tabs, Tab, IconButton, Tooltip,
} from '@mui/material';
import { ContentCopy as CopyIcon, Clear as ClearIcon, Code as CodeIcon, Share as ShareIcon, Image as ImageIcon } from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`meta-tabpanel-${index}`}
      aria-labelledby={`meta-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const MetaTagGenerator: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [metaData, setMetaData] = useState({
    title: '',
    description: '',
    image: '',
    url: '',
    keywords: '',
    author: '',
    twitterHandle: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setMetaData({ ...metaData, [field]: event.target.value });
    setError('');
    setSuccess('');
  };

  const generateBasicMetaTags = () => {
    const tags = [];
    
    if (metaData.title) {
      tags.push(`<title>${metaData.title}</title>`);
      tags.push(`<meta name="title" content="${metaData.title}">`);
    }
    
    if (metaData.description) {
      tags.push(`<meta name="description" content="${metaData.description}">`);
    }
    
    if (metaData.keywords) {
      tags.push(`<meta name="keywords" content="${metaData.keywords}">`);
    }
    
    if (metaData.author) {
      tags.push(`<meta name="author" content="${metaData.author}">`);
    }
    
    if (metaData.url) {
      tags.push(`<link rel="canonical" href="${metaData.url}">`);
    }
    
    tags.push(`<meta name="robots" content="index, follow">`);
    tags.push(`<meta charset="UTF-8">`);
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    
    return tags.join('\n');
  };

  const generateOpenGraphTags = () => {
    const tags = [];
    
    tags.push(`<!-- Open Graph / Facebook -->`);
    tags.push(`<meta property="og:type" content="website">`);
    
    if (metaData.url) {
      tags.push(`<meta property="og:url" content="${metaData.url}">`);
    }
    
    if (metaData.title) {
      tags.push(`<meta property="og:title" content="${metaData.title}">`);
    }
    
    if (metaData.description) {
      tags.push(`<meta property="og:description" content="${metaData.description}">`);
    }
    
    if (metaData.image) {
      tags.push(`<meta property="og:image" content="${metaData.image}">`);
    }
    
    return tags.join('\n');
  };

  const generateTwitterTags = () => {
    const tags = [];
    
    tags.push(`<!-- Twitter -->`);
    tags.push(`<meta property="twitter:card" content="summary_large_image">`);
    
    if (metaData.url) {
      tags.push(`<meta property="twitter:url" content="${metaData.url}">`);
    }
    
    if (metaData.title) {
      tags.push(`<meta property="twitter:title" content="${metaData.title}">`);
    }
    
    if (metaData.description) {
      tags.push(`<meta property="twitter:description" content="${metaData.description}">`);
    }
    
    if (metaData.image) {
      tags.push(`<meta property="twitter:image" content="${metaData.image}">`);
    }
    
    if (metaData.twitterHandle) {
      tags.push(`<meta property="twitter:creator" content="${metaData.twitterHandle}">`);
    }
    
    return tags.join('\n');
  };

  const generateAllTags = () => {
    return `${generateBasicMetaTags()}\n\n${generateOpenGraphTags()}\n\n${generateTwitterTags()}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('Meta tags copied to clipboard!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to copy to clipboard. Please copy manually.');
    }
  };

  const clearAll = () => {
    setMetaData({
      title: '',
      description: '',
      image: '',
      url: '',
      keywords: '',
      author: '',
      twitterHandle: '',
    });
    setError('');
    setSuccess('');
  };

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Meta Tag Generator
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Generate comprehensive meta tags for your website. Includes basic SEO tags, Open Graph for Facebook, and Twitter Cards.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Meta Information
              </Typography>

              <TextField
                fullWidth
                label="Page Title"
                value={metaData.title}
                onChange={handleInputChange('title')}
                placeholder="Enter your page title"
                sx={{ mb: 3 }}
                helperText="The main title of your page (50-60 characters recommended)"
              />

              <TextField
                fullWidth
                label="Description"
                value={metaData.description}
                onChange={handleInputChange('description')}
                placeholder="Enter your page description"
                multiline
                rows={3}
                sx={{ mb: 3 }}
                helperText="Brief description of your page (150-160 characters recommended)"
              />

              <TextField
                fullWidth
                label="URL"
                value={metaData.url}
                onChange={handleInputChange('url')}
                placeholder="https://example.com/page"
                sx={{ mb: 3 }}
                helperText="The canonical URL of your page"
              />

              <TextField
                fullWidth
                label="Image URL"
                value={metaData.image}
                onChange={handleInputChange('image')}
                placeholder="https://example.com/image.jpg"
                sx={{ mb: 3 }}
                helperText="Image to display when shared on social media (1200x630px recommended)"
              />

              <TextField
                fullWidth
                label="Keywords"
                value={metaData.keywords}
                onChange={handleInputChange('keywords')}
                placeholder="keyword1, keyword2, keyword3"
                sx={{ mb: 3 }}
                helperText="Comma-separated keywords (optional)"
              />

              <TextField
                fullWidth
                label="Author"
                value={metaData.author}
                onChange={handleInputChange('author')}
                placeholder="Your name or company"
                sx={{ mb: 3 }}
                helperText="Author or organization name"
              />

              <TextField
                fullWidth
                label="Twitter Handle"
                value={metaData.twitterHandle}
                onChange={handleInputChange('twitterHandle')}
                placeholder="@username"
                sx={{ mb: 3 }}
                helperText="Your Twitter username (without @)"
              />

              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearAll}
                fullWidth
              >
                Clear All
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Generated Meta Tags
              </Typography>

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="meta tag tabs">
                  <Tab label="Basic" />
                  <Tab label="Open Graph" />
                  <Tab label="Twitter" />
                  <Tab label="All" />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Basic Meta Tags
                    </Typography>
                    <Tooltip title="Copy to clipboard">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(generateBasicMetaTags())}
                      >
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      p: 2,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      overflow: 'auto',
                      maxHeight: '300px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {generateBasicMetaTags()}
                  </Box>
                </Paper>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Open Graph Tags (Facebook)
                    </Typography>
                    <Tooltip title="Copy to clipboard">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(generateOpenGraphTags())}
                      >
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      p: 2,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      overflow: 'auto',
                      maxHeight: '300px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {generateOpenGraphTags()}
                  </Box>
                </Paper>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Twitter Card Tags
                    </Typography>
                    <Tooltip title="Copy to clipboard">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(generateTwitterTags())}
                      >
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      p: 2,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      overflow: 'auto',
                      maxHeight: '300px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {generateTwitterTags()}
                  </Box>
                </Paper>
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      All Meta Tags
                    </Typography>
                    <Tooltip title="Copy to clipboard">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(generateAllTags())}
                      >
                        <CopyIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      p: 2,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      overflow: 'auto',
                      maxHeight: '300px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {generateAllTags()}
                  </Box>
                </Paper>
              </TabPanel>
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

export default MetaTagGenerator;
