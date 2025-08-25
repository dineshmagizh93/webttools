import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import GoogleAd from '../components/GoogleAd';
import {
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  QrCode as QrIcon,
  Compress as CompressIcon,
  TextFields as TextIcon,
  VolumeUp as VolumeIcon,
  Mic as MicIcon,
  RemoveCircle as RemoveIcon,
  Lock as LockIcon,
  Timer as TimerIcon,
  ContentCut as SplitIcon,
  PhotoCamera as CameraIcon,
  Code as CodeIcon,
  Tag as TagIcon,
  Link as LinkIcon,
  DataObject as JsonIcon,
  SwapHoriz as Base64Icon,
  Palette as ColorIcon,
  Edit as NotepadIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const tools = [
  {
    title: 'PDF Compressor',
    description: 'Compress PDF files to reduce size while maintaining quality',
    icon: <PdfIcon sx={{ fontSize: 40 }} />,
    path: '/pdf-compressor',
    color: '#ff6b6b',
    tags: ['PDF', 'Compression'],
  },
  {
    title: 'JPG to PDF',
    description: 'Convert multiple JPG/PNG images to a single PDF document',
    icon: <ImageIcon sx={{ fontSize: 40 }} />,
    path: '/jpg-to-pdf',
    color: '#4ecdc4',
    tags: ['Image', 'PDF'],
  },
  {
    title: 'QR Code Generator',
    description: 'Generate QR codes for URLs, text, email, and Wi-Fi networks',
    icon: <QrIcon sx={{ fontSize: 40 }} />,
    path: '/qr-generator',
    color: '#45b7d1',
    tags: ['QR Code', 'Generator'],
  },
  {
    title: 'Image Compressor',
    description: 'Compress images to reduce file size while preserving quality',
    icon: <CompressIcon sx={{ fontSize: 40 }} />,
    path: '/image-compressor',
    color: '#96ceb4',
    tags: ['Image', 'Compression'],
  },
  {
    title: 'Word Counter',
    description: 'Count words, characters, sentences, and paragraphs in text',
    icon: <TextIcon sx={{ fontSize: 40 }} />,
    path: '/word-counter',
    color: '#feca57',
    tags: ['Text', 'Analysis'],
  },
  {
    title: 'Text to Speech',
    description: 'Convert text to speech with multiple voice options',
    icon: <VolumeIcon sx={{ fontSize: 40 }} />,
    path: '/text-to-speech',
    color: '#ff9ff3',
    tags: ['Audio', 'TTS'],
  },
  {
    title: 'Speech to Text',
    description: 'Convert speech to text using your microphone',
    icon: <MicIcon sx={{ fontSize: 40 }} />,
    path: '/speech-to-text',
    color: '#54a0ff',
    tags: ['Audio', 'STT'],
  },
  {
    title: 'Remove Background',
    description: 'Remove background from images with AI-powered technology',
    icon: <RemoveIcon sx={{ fontSize: 40 }} />,
    path: '/remove-background',
    color: '#5f27cd',
    tags: ['AI', 'Image'],
  },
  {
    title: 'Password Generator',
    description: 'Generate strong, secure passwords with customizable options',
    icon: <LockIcon sx={{ fontSize: 40 }} />,
    path: '/password-generator',
    color: '#00d2d3',
    tags: ['Security', 'Generator'],
  },
  {
    title: 'Stopwatch & Timer',
    description: 'Stopwatch with lap feature and countdown timer with alerts',
    icon: <TimerIcon sx={{ fontSize: 40 }} />,
    path: '/stopwatch-timer',
    color: '#ff9f43',
    tags: ['Time', 'Utility'],
  },
  {
    title: 'PDF Split',
    description: 'Split PDF files by page ranges and extract specific pages',
    icon: <SplitIcon sx={{ fontSize: 40 }} />,
    path: '/pdf-split',
    color: '#e74c3c',
    tags: ['PDF', 'Split'],
  },
  {
    title: 'PDF to JPG',
    description: 'Convert PDF pages to high-quality JPG images',
    icon: <CameraIcon sx={{ fontSize: 40 }} />,
    path: '/pdf-to-jpg',
    color: '#3498db',
    tags: ['PDF', 'Image'],
  },
  {
    title: 'JPG to PNG',
    description: 'Convert JPG images to PNG format with transparency support',
    icon: <ImageIcon sx={{ fontSize: 40 }} />,
    path: '/jpg-to-png',
    color: '#2ecc71',
    tags: ['Image', 'Convert'],
  },
  {
    title: 'HTML to PDF',
    description: 'Convert HTML content to PDF with custom styling',
    icon: <CodeIcon sx={{ fontSize: 40 }} />,
    path: '/html-to-pdf',
    color: '#9b59b6',
    tags: ['HTML', 'PDF'],
  },
  {
    title: 'Meta Tag Generator',
    description: 'Generate SEO meta tags for HTML and social media',
    icon: <TagIcon sx={{ fontSize: 40 }} />,
    path: '/meta-tag-generator',
    color: '#f39c12',
    tags: ['SEO', 'Meta'],
  },
  {
    title: 'UTM Link Builder',
    description: 'Create UTM-tracked URLs for marketing campaigns',
    icon: <LinkIcon sx={{ fontSize: 40 }} />,
    path: '/utm-link-builder',
    color: '#e67e22',
    tags: ['Marketing', 'Analytics'],
  },
  {
    title: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data',
    icon: <JsonIcon sx={{ fontSize: 40 }} />,
    path: '/json-formatter',
    color: '#8e44ad',
    tags: ['JSON', 'Developer'],
  },
  {
    title: 'Base64 Converter',
    description: 'Encode text to Base64 or decode Base64 strings',
    icon: <Base64Icon sx={{ fontSize: 40 }} />,
    path: '/base64-converter',
    color: '#16a085',
    tags: ['Encoding', 'Developer'],
  },
  {
    title: 'Color Picker',
    description: 'Select colors and get HEX, RGB, HSL values',
    icon: <ColorIcon sx={{ fontSize: 40 }} />,
    path: '/color-picker',
    color: '#e74c3c',
    tags: ['Design', 'Colors'],
  },
  {
    title: 'Online Notepad',
    description: 'Distraction-free writing with auto-save',
    icon: <NotepadIcon sx={{ fontSize: 40 }} />,
    path: '/online-notepad',
    color: '#27ae60',
    tags: ['Writing', 'Notes'],
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 3,
            background: 'linear-gradient(45deg, #90caf9, #f48fb1)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '2.5rem', md: '3.5rem' },
            lineHeight: 1.2,
          }}
        >
          Pixmerge
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          sx={{ mb: 4, fontWeight: 300, lineHeight: 1.4 }}
        >
          Your all-in-one toolkit for everyday tasks
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 700, mx: 'auto', lineHeight: 1.6 }}
        >
          Free, fast, and secure online tools to help you with PDF compression, 
          image processing, text analysis, and much more. No registration required.
        </Typography>
      </Box>

      {/* Top Banner Ad */}
      <GoogleAd adSlot="1234567890" adFormat="banner" />

      <Grid container spacing={4}>
        {tools.map((tool) => (
          <Grid item xs={12} sm={6} lg={4} xl={3} key={tool.title}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4)',
                  '& .tool-icon': {
                    transform: 'scale(1.1)',
                  },
                },
                background: `linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)`,
                border: '1px solid #333',
              }}
              onClick={() => navigate(tool.path)}
            >
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Box
                  className="tool-icon"
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    background: `linear-gradient(135deg, ${tool.color}20, ${tool.color}40)`,
                    border: `2px solid ${tool.color}`,
                    transition: 'transform 0.3s ease-in-out',
                    color: tool.color,
                  }}
                >
                  {tool.icon}
                </Box>
                
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: 'text.primary',
                    lineHeight: 1.3,
                  }}
                >
                  {tool.title}
                </Typography>
                
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  {tool.description}
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {tool.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{
                        fontSize: '0.7rem',
                        height: 20,
                        backgroundColor: `${tool.color}20`,
                        color: tool.color,
                        border: `1px solid ${tool.color}40`,
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Bottom Banner Ad */}
      <GoogleAd adSlot="0987654321" adFormat="banner" />

      <Box sx={{ textAlign: 'center', mt: 10, pt: 6, borderTop: '1px solid #333' }}>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          All tools are free to use and work entirely in your browser. 
          No data is sent to our servers.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;
