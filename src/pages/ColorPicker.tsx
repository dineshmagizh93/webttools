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
  Slider,
} from '@mui/material';
import {
  Copy as CopyIcon,
  Clear as ClearIcon,
  Palette as PaletteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

const ColorPicker: React.FC = () => {
  const [selectedColor, setSelectedColor] = useState<string>('#3f51b5');
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: '#3f51b5',
    rgb: { r: 63, g: 81, b: 181 },
    hsl: { h: 231, s: 48, l: 48 },
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hex = event.target.value;
    setSelectedColor(hex);
    
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    setColorValues({ hex, rgb, hsl });
    setError('');
    setSuccess('');
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 0;
    const clampedValue = Math.max(0, Math.min(255, value));
    
    const newRgb = { ...colorValues.rgb, [component]: clampedValue };
    const hex = `#${newRgb.r.toString(16).padStart(2, '0')}${newRgb.g.toString(16).padStart(2, '0')}${newRgb.b.toString(16).padStart(2, '0')}`;
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    
    setSelectedColor(hex);
    setColorValues({ hex, rgb: newRgb, hsl });
    setError('');
    setSuccess('');
  };

  const handleHslChange = (component: 'h' | 's' | 'l') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value) || 0;
    let clampedValue = value;
    
    if (component === 'h') {
      clampedValue = Math.max(0, Math.min(360, value));
    } else {
      clampedValue = Math.max(0, Math.min(100, value));
    }
    
    const newHsl = { ...colorValues.hsl, [component]: clampedValue };
    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    const hex = `#${rgb.r.toString(16).padStart(2, '0')}${rgb.g.toString(16).padStart(2, '0')}${rgb.b.toString(16).padStart(2, '0')}`;
    
    setSelectedColor(hex);
    setColorValues({ hex, rgb, hsl: newHsl });
    setError('');
    setSuccess('');
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess('Color value copied to clipboard!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to copy to clipboard. Please copy manually.');
    }
  };

  const generateRandomColor = () => {
    const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setSelectedColor(hex);
    
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    setColorValues({ hex, rgb, hsl });
    setError('');
    setSuccess('');
  };

  const clearAll = () => {
    setSelectedColor('#3f51b5');
    setColorValues({
      hex: '#3f51b5',
      rgb: { r: 63, g: 81, b: 181 },
      hsl: { h: 231, s: 48, l: 48 },
    });
    setError('');
    setSuccess('');
  };

  const getContrastColor = (hex: string): string => {
    const rgb = hexToRgb(hex);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  const predefinedColors = [
    '#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00', 
    '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff',
    '#ff00ff', '#ff0080', '#ffffff', '#cccccc', '#999999',
    '#666666', '#333333', '#000000'
  ];

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Color Picker
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Select colors and get their values in HEX, RGB, and HSL formats. Copy color codes with one click.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Color Selection
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={handleColorChange}
                  style={{
                    width: '60px',
                    height: '60px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                  }}
                />
                <TextField
                  fullWidth
                  label="HEX Color"
                  value={selectedColor}
                  onChange={handleColorChange}
                  placeholder="#000000"
                  sx={{ flex: 1 }}
                />
              </Box>

              <Paper 
                sx={{ 
                  p: 3, 
                  mb: 3, 
                  backgroundColor: selectedColor,
                  color: getContrastColor(selectedColor),
                  borderRadius: 2,
                  textAlign: 'center',
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {selectedColor}
                </Typography>
                <Typography variant="body2">
                  rgb({colorValues.rgb.r}, {colorValues.rgb.g}, {colorValues.rgb.b})
                </Typography>
                <Typography variant="body2">
                  hsl({colorValues.hsl.h}°, {colorValues.hsl.s}%, {colorValues.hsl.l}%)
                </Typography>
              </Paper>

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={generateRandomColor}
                  sx={{ flex: 1 }}
                >
                  Random Color
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={clearAll}
                  sx={{ flex: 1 }}
                >
                  Reset
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Color Values
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  HEX Color:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    value={colorValues.hex}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                  <Tooltip title="Copy HEX">
                    <IconButton onClick={() => copyToClipboard(colorValues.hex)}>
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  RGB Values:
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Red"
                      type="number"
                      value={colorValues.rgb.r}
                      onChange={handleRgbChange('r')}
                      inputProps={{ min: 0, max: 255 }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Green"
                      type="number"
                      value={colorValues.rgb.g}
                      onChange={handleRgbChange('g')}
                      inputProps={{ min: 0, max: 255 }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Blue"
                      type="number"
                      value={colorValues.rgb.b}
                      onChange={handleRgbChange('b')}
                      inputProps={{ min: 0, max: 255 }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    value={`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                  <Tooltip title="Copy RGB">
                    <IconButton onClick={() => copyToClipboard(`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`)}>
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  HSL Values:
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Hue"
                      type="number"
                      value={colorValues.hsl.h}
                      onChange={handleHslChange('h')}
                      inputProps={{ min: 0, max: 360 }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Saturation"
                      type="number"
                      value={colorValues.hsl.s}
                      onChange={handleHslChange('s')}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Lightness"
                      type="number"
                      value={colorValues.hsl.l}
                      onChange={handleHslChange('l')}
                      inputProps={{ min: 0, max: 100 }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    value={`hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`}
                    InputProps={{ readOnly: true }}
                    variant="outlined"
                  />
                  <Tooltip title="Copy HSL">
                    <IconButton onClick={() => copyToClipboard(`hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`)}>
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Predefined Colors
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {predefinedColors.map((color) => (
              <Box
                key={color}
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: color,
                  borderRadius: 1,
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'scale(1.1)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
                onClick={() => {
                  setSelectedColor(color);
                  const rgb = hexToRgb(color);
                  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                  setColorValues({ hex: color, rgb, hsl });
                }}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

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
            Color Formats Guide
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                HEX Format:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • 6-digit hexadecimal code<br />
                • Example: #FF0000 (red)<br />
                • Most common in web design<br />
                • Range: #000000 to #FFFFFF
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                RGB Format:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Red, Green, Blue values<br />
                • Example: rgb(255, 0, 0)<br />
                • Each value: 0-255<br />
                • Good for digital displays
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                HSL Format:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Hue, Saturation, Lightness<br />
                • Example: hsl(0, 100%, 50%)<br />
                • Hue: 0-360°, Sat/Light: 0-100%<br />
                • Intuitive for color adjustments
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ColorPicker;
