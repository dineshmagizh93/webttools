import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PdfCompressor from './pages/PdfCompressor';
import JpgToPdf from './pages/JpgToPdf';
import QrCodeGenerator from './pages/QrCodeGenerator';
import ImageCompressor from './pages/ImageCompressor';
import WordCounter from './pages/WordCounter';
import TextToSpeech from './pages/TextToSpeech';
import SpeechToText from './pages/SpeechToText';
import RemoveBackground from './pages/RemoveBackground';
import PasswordGenerator from './pages/PasswordGenerator';
import StopwatchTimer from './pages/StopwatchTimer';
import PdfSplit from './pages/PdfSplit';
import PdfToJpg from './pages/PdfToJpg';
import JpgToPng from './pages/JpgToPng';
import HtmlToPdf from './pages/HtmlToPdf';
import MetaTagGenerator from './pages/MetaTagGenerator';
import UtmLinkBuilder from './pages/UtmLinkBuilder';
import JsonFormatter from './pages/JsonFormatter';
import Base64Converter from './pages/Base64Converter';
import ColorPicker from './pages/ColorPicker';
import OnlineNotepad from './pages/OnlineNotepad';

// Create dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#0a0a0a',
      paper: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(145deg, #1a1a1a 0%, #2a2a2a 100%)',
          border: '1px solid #333',
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
          <Navbar />
          <Box sx={{ pt: 10, pb: 6 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pdf-compressor" element={<PdfCompressor />} />
              <Route path="/jpg-to-pdf" element={<JpgToPdf />} />
              <Route path="/qr-generator" element={<QrCodeGenerator />} />
              <Route path="/image-compressor" element={<ImageCompressor />} />
              <Route path="/word-counter" element={<WordCounter />} />
              <Route path="/text-to-speech" element={<TextToSpeech />} />
              <Route path="/speech-to-text" element={<SpeechToText />} />
              <Route path="/remove-background" element={<RemoveBackground />} />
              <Route path="/password-generator" element={<PasswordGenerator />} />
              <Route path="/stopwatch-timer" element={<StopwatchTimer />} />
              <Route path="/pdf-split" element={<PdfSplit />} />
              <Route path="/pdf-to-jpg" element={<PdfToJpg />} />
              <Route path="/jpg-to-png" element={<JpgToPng />} />
              <Route path="/html-to-pdf" element={<HtmlToPdf />} />
              <Route path="/meta-tag-generator" element={<MetaTagGenerator />} />
              <Route path="/utm-link-builder" element={<UtmLinkBuilder />} />
              <Route path="/json-formatter" element={<JsonFormatter />} />
              <Route path="/base64-converter" element={<Base64Converter />} />
              <Route path="/color-picker" element={<ColorPicker />} />
              <Route path="/online-notepad" element={<OnlineNotepad />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
