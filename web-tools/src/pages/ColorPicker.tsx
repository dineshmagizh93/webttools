import React, { useState } from 'react';
import {
  Container, Box, Typography, Card, CardContent, Button, Alert, Grid, Paper, TextField, IconButton, Tooltip, Slider,
} from '@mui/material';
import { ContentCopy as CopyIcon, Clear as ClearIcon, Palette as PaletteIcon } from '@mui/icons-material';

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
    hsl: { h: 231, s: 48, l: 48 }
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

  const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
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

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const hex = event.target.value;
    setSelectedColor(hex);
    
    if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setColorValues({ hex, rgb, hsl });
      setError('');
    }
  };

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...colorValues.rgb, [component]: value };
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    
    setSelectedColor(hex);
    setColorValues({ hex, rgb: newRgb, hsl });
    setError('');
  };

  const handleHslChange = (component: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...colorValues.hsl, [component]: value };
    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    
    setSelectedColor(hex);
    setColorValues({ hex, rgb, hsl: newHsl });
    setError('');
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
    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setSelectedColor(randomHex);
    
    const rgb = hexToRgb(randomHex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setColorValues({ hex: randomHex, rgb, hsl });
    setError('');
  };

  const getContrastColor = (hex: string): string => {
    const rgb = hexToRgb(hex);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  const getColorName = (hex: string): string => {
    const colorMap: { [key: string]: string } = {
      '#ff0000': 'Red',
      '#00ff00': 'Green',
      '#0000ff': 'Blue',
      '#ffff00': 'Yellow',
      '#ff00ff': 'Magenta',
      '#00ffff': 'Cyan',
      '#000000': 'Black',
      '#ffffff': 'White',
      '#ffa500': 'Orange',
      '#800080': 'Purple',
      '#008000': 'Green',
      '#ffc0cb': 'Pink',
      '#a52a2a': 'Brown',
      '#808080': 'Gray',
    };
    
    return colorMap[hex.toLowerCase()] || 'Custom Color';
  };

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Color Picker
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
          Select colors and get HEX, RGB, and HSL values. Perfect for designers and developers.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Color Selection
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Pick a Color:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                  <Button
                    variant="outlined"
                    startIcon={<PaletteIcon />}
                    onClick={generateRandomColor}
                  >
                    Random Color
                  </Button>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  Color Preview:
                </Typography>
                <Paper
                  sx={{
                    p: 3,
                    backgroundColor: selectedColor,
                    borderRadius: 2,
                    textAlign: 'center',
                    color: getContrastColor(selectedColor),
                    minHeight: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {getColorName(selectedColor)}
                  </Typography>
                  <Typography variant="body2">
                    {selectedColor.toUpperCase()}
                  </Typography>
                </Paper>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={() => {
                    setSelectedColor('#3f51b5');
                    setColorValues({
                      hex: '#3f51b5',
                      rgb: { r: 63, g: 81, b: 181 },
                      hsl: { h: 231, s: 48, l: 48 }
                    });
                  }}
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
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  HEX Color:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    value={colorValues.hex}
                    onChange={(e) => {
                      const hex = e.target.value;
                      if (hex.match(/^#[0-9A-Fa-f]{6}$/)) {
                        setSelectedColor(hex);
                        const rgb = hexToRgb(hex);
                        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
                        setColorValues({ hex, rgb, hsl });
                      }
                    }}
                    placeholder="#000000"
                    sx={{ fontFamily: 'monospace' }}
                  />
                  <Tooltip title="Copy HEX">
                    <IconButton
                      onClick={() => copyToClipboard(colorValues.hex)}
                    >
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  RGB Values:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Red (R)
                    </Typography>
                    <Slider
                      value={colorValues.rgb.r}
                      onChange={(_, value) => handleRgbChange('r', value as number)}
                      min={0}
                      max={255}
                      valueLabelDisplay="auto"
                      sx={{ color: '#f44336' }}
                    />
                    <TextField
                      size="small"
                      value={colorValues.rgb.r}
                      onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                      sx={{ mt: 1, fontFamily: 'monospace' }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Green (G)
                    </Typography>
                    <Slider
                      value={colorValues.rgb.g}
                      onChange={(_, value) => handleRgbChange('g', value as number)}
                      min={0}
                      max={255}
                      valueLabelDisplay="auto"
                      sx={{ color: '#4caf50' }}
                    />
                    <TextField
                      size="small"
                      value={colorValues.rgb.g}
                      onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                      sx={{ mt: 1, fontFamily: 'monospace' }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Blue (B)
                    </Typography>
                    <Slider
                      value={colorValues.rgb.b}
                      onChange={(_, value) => handleRgbChange('b', value as number)}
                      min={0}
                      max={255}
                      valueLabelDisplay="auto"
                      sx={{ color: '#2196f3' }}
                    />
                    <TextField
                      size="small"
                      value={colorValues.rgb.b}
                      onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                      sx={{ mt: 1, fontFamily: 'monospace' }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <TextField
                    fullWidth
                    value={`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`}
                    InputProps={{ readOnly: true }}
                    sx={{ fontFamily: 'monospace' }}
                  />
                  <Tooltip title="Copy RGB">
                    <IconButton
                      onClick={() => copyToClipboard(`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`)}
                    >
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                  HSL Values:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Hue (H)
                    </Typography>
                    <Slider
                      value={colorValues.hsl.h}
                      onChange={(_, value) => handleHslChange('h', value as number)}
                      min={0}
                      max={360}
                      valueLabelDisplay="auto"
                    />
                    <TextField
                      size="small"
                      value={colorValues.hsl.h}
                      onChange={(e) => handleHslChange('h', parseInt(e.target.value) || 0)}
                      sx={{ mt: 1, fontFamily: 'monospace' }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Saturation (S)
                    </Typography>
                    <Slider
                      value={colorValues.hsl.s}
                      onChange={(_, value) => handleHslChange('s', value as number)}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                    />
                    <TextField
                      size="small"
                      value={colorValues.hsl.s}
                      onChange={(e) => handleHslChange('s', parseInt(e.target.value) || 0)}
                      sx={{ mt: 1, fontFamily: 'monospace' }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Lightness (L)
                    </Typography>
                    <Slider
                      value={colorValues.hsl.l}
                      onChange={(_, value) => handleHslChange('l', value as number)}
                      min={0}
                      max={100}
                      valueLabelDisplay="auto"
                    />
                    <TextField
                      size="small"
                      value={colorValues.hsl.l}
                      onChange={(e) => handleHslChange('l', parseInt(e.target.value) || 0)}
                      sx={{ mt: 1, fontFamily: 'monospace' }}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                  <TextField
                    fullWidth
                    value={`hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`}
                    InputProps={{ readOnly: true }}
                    sx={{ fontFamily: 'monospace' }}
                  />
                  <Tooltip title="Copy HSL">
                    <IconButton
                      onClick={() => copyToClipboard(`hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`)}
                    >
                      <CopyIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
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
            Color Formats Explained
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                HEX Color:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • 6-digit hexadecimal code<br />
                • Format: #RRGGBB<br />
                • Range: 00-FF for each component<br />
                • Example: #FF0000 (red)
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                RGB Color:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                • Red, Green, Blue values<br />
                • Format: rgb(r, g, b)<br />
                • Range: 0-255 for each component<br />
                • Example: rgb(255, 0, 0) (red)
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                HSL Color:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Hue, Saturation, Lightness<br />
                • Format: hsl(h, s%, l%)<br />
                • Hue: 0-360°, Saturation/Lightness: 0-100%<br />
                • Example: hsl(0, 100%, 50%) (red)
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ColorPicker;
