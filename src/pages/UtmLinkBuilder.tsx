import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Alert,
  Grid,
  Paper,
  TextField,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Copy as CopyIcon,
  Clear as ClearIcon,
  Link as LinkIcon,
  OpenInNew as OpenIcon,
} from '@mui/icons-material';

interface UtmParams {
  baseUrl: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
}

const UtmLinkBuilder: React.FC = () => {
  const [utmParams, setUtmParams] = useState<UtmParams>({
    baseUrl: '',
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleInputChange = (field: keyof UtmParams) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setUtmParams({ ...utmParams, [field]: event.target.value });
    setError('');
    setSuccess('');
  };

  const generateUtmUrl = (): string => {
    if (!utmParams.baseUrl.trim()) {
      setError('Please enter a base URL.');
      return '';
    }

    let url = utmParams.baseUrl.trim();
    
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    const params = new URLSearchParams();
    
    if (utmParams.source) params.append('utm_source', utmParams.source);
    if (utmParams.medium) params.append('utm_medium', utmParams.medium);
    if (utmParams.campaign) params.append('utm_campaign', utmParams.campaign);
    if (utmParams.term) params.append('utm_term', utmParams.term);
    if (utmParams.content) params.append('utm_content', utmParams.content);

    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('URL copied to clipboard!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to copy to clipboard. Please copy manually.');
    }
  };

  const clearAll = () => {
    setUtmParams({
      baseUrl: '',
      source: '',
      medium: '',
      campaign: '',
      term: '',
      content: '',
    });
    setError('');
    setSuccess('');
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const generatedUrl = generateUtmUrl();

  const presetMediums = ['cpc', 'email', 'social', 'banner', 'affiliate', 'referral', 'organic'];
  const presetSources = ['google', 'facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'email'];

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          UTM Link Builder
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Create UTM-tracked URLs for your marketing campaigns. Track traffic sources, mediums, and campaigns in Google Analytics.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Campaign Parameters
              </Typography>

              <TextField
                fullWidth
                label="Base URL"
                value={utmParams.baseUrl}
                onChange={handleInputChange('baseUrl')}
                placeholder="https://example.com/page"
                sx={{ mb: 3 }}
                helperText="The main URL you want to track (with or without https://)"
              />

              <TextField
                fullWidth
                label="Campaign Source (utm_source)"
                value={utmParams.source}
                onChange={handleInputChange('source')}
                placeholder="google, facebook, email"
                sx={{ mb: 3 }}
                helperText="The source of your traffic"
              />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Common Sources:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {presetSources.map((source) => (
                    <Chip
                      key={source}
                      label={source}
                      size="small"
                      onClick={() => setUtmParams({ ...utmParams, source })}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Campaign Medium (utm_medium)"
                value={utmParams.medium}
                onChange={handleInputChange('medium')}
                placeholder="cpc, email, social"
                sx={{ mb: 3 }}
                helperText="The marketing medium"
              />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Common Mediums:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {presetMediums.map((medium) => (
                    <Chip
                      key={medium}
                      label={medium}
                      size="small"
                      onClick={() => setUtmParams({ ...utmParams, medium })}
                      sx={{ cursor: 'pointer' }}
                    />
                  ))}
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Campaign Name (utm_campaign)"
                value={utmParams.campaign}
                onChange={handleInputChange('campaign')}
                placeholder="summer_sale_2024"
                sx={{ mb: 3 }}
                helperText="The name of your campaign"
              />

              <TextField
                fullWidth
                label="Campaign Term (utm_term)"
                value={utmParams.term}
                onChange={handleInputChange('term')}
                placeholder="keyword1, keyword2"
                sx={{ mb: 3 }}
                helperText="Paid search keywords (optional)"
              />

              <TextField
                fullWidth
                label="Campaign Content (utm_content)"
                value={utmParams.content}
                onChange={handleInputChange('content')}
                placeholder="banner_ad, text_link"
                sx={{ mb: 3 }}
                helperText="Used to differentiate similar content or links"
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
                Generated UTM URL
              </Typography>

              {generatedUrl ? (
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Your UTM URL:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Copy URL">
                        <IconButton
                          size="small"
                          onClick={() => copyToClipboard(generatedUrl)}
                        >
                          <CopyIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Open URL">
                        <IconButton
                          size="small"
                          onClick={() => openUrl(generatedUrl)}
                        >
                          <OpenIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Box
                    component="pre"
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      p: 2,
                      borderRadius: 1,
                      fontSize: '0.875rem',
                      overflow: 'auto',
                      wordBreak: 'break-all',
                      fontFamily: 'monospace',
                      color: '#90caf9',
                    }}
                  >
                    {generatedUrl}
                  </Box>
                </Paper>
              ) : (
                <Paper sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2, mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Enter a base URL and campaign parameters to generate your UTM URL
                  </Typography>
                </Paper>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  URL Breakdown:
                </Typography>
                {utmParams.baseUrl && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Base URL:</strong> {utmParams.baseUrl}
                    </Typography>
                  </Box>
                )}
                {Object.entries(utmParams).map(([key, value]) => {
                  if (key !== 'baseUrl' && value) {
                    return (
                      <Box key={key} sx={{ mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>utm_{key}:</strong> {value}
                        </Typography>
                      </Box>
                    );
                  }
                  return null;
                })}
              </Box>

              <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  URL Length: {generatedUrl.length} characters
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {generatedUrl.length > 2048 ? 
                    '⚠️ URL is very long and may be truncated by some browsers' : 
                    '✅ URL length is acceptable'
                  }
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

      <Card sx={{ mt: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            UTM Parameters Guide
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                utm_source:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Identifies the source of traffic<br />
                • Examples: google, facebook, email, newsletter<br />
                • Use lowercase, no spaces
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                utm_medium:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Identifies the marketing medium<br />
                • Examples: cpc, email, social, banner<br />
                • Use lowercase, no spaces
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                utm_campaign:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Identifies the specific campaign<br />
                • Examples: summer_sale, black_friday<br />
                • Use underscores instead of spaces
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                utm_term & utm_content:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • utm_term: Paid search keywords<br />
                • utm_content: Differentiate similar content<br />
                • Both are optional but useful for detailed tracking
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UtmLinkBuilder;
