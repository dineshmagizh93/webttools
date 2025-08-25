import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Slider,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  QrCode as QrIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { QRCodeCanvas } from 'qrcode.react';

type QRType = 'url' | 'text' | 'email' | 'phone' | 'wifi' | 'vcard';

interface WiFiData {
  ssid: string;
  password: string;
  encryption: 'WPA' | 'WEP' | 'nopass';
}

interface VCardData {
  name: string;
  phone: string;
  email: string;
  company: string;
}

const QrCodeGenerator: React.FC = () => {
  const [qrType, setQrType] = useState<QRType>('url');
  const [qrValue, setQrValue] = useState<string>('');
  const [size, setSize] = useState<number>(256);
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [includeLogo, setIncludeLogo] = useState<boolean>(false);
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  
  // WiFi specific data
  const [wifiData, setWifiData] = useState<WiFiData>({
    ssid: '',
    password: '',
    encryption: 'WPA',
  });

  // VCard specific data
  const [vcardData, setVcardData] = useState<VCardData>({
    name: '',
    phone: '',
    email: '',
    company: '',
  });

  const generateQRValue = (): string => {
    switch (qrType) {
      case 'url':
        return qrValue.startsWith('http') ? qrValue : `https://${qrValue}`;
      case 'text':
        return qrValue;
      case 'email':
        return `mailto:${qrValue}`;
      case 'phone':
        return `tel:${qrValue}`;
      case 'wifi':
        return `WIFI:T:${wifiData.encryption};S:${wifiData.ssid};P:${wifiData.password};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardData.name}\nTEL:${vcardData.phone}\nEMAIL:${vcardData.email}\nORG:${vcardData.company}\nEND:VCARD`;
      default:
        return qrValue;
    }
  };

  const downloadQR = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `qrcode-${qrType}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateQRValue());
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const clearAll = () => {
    setQrValue('');
    setWifiData({ ssid: '', password: '', encryption: 'WPA' });
    setVcardData({ name: '', phone: '', email: '', company: '' });
  };

  const renderInputFields = () => {
    switch (qrType) {
      case 'wifi':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="WiFi Network Name (SSID)"
                value={wifiData.ssid}
                onChange={(e) => setWifiData(prev => ({ ...prev, ssid: e.target.value }))}
                placeholder="Enter WiFi network name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={wifiData.password}
                onChange={(e) => setWifiData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter WiFi password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Encryption Type</InputLabel>
                <Select
                  value={wifiData.encryption}
                  onChange={(e) => setWifiData(prev => ({ ...prev, encryption: e.target.value as 'WPA' | 'WEP' | 'nopass' }))}
                >
                  <MenuItem value="WPA">WPA/WPA2/WPA3</MenuItem>
                  <MenuItem value="WEP">WEP</MenuItem>
                  <MenuItem value="nopass">No Password</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );

      case 'vcard':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={vcardData.name}
                onChange={(e) => setVcardData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                value={vcardData.phone}
                onChange={(e) => setVcardData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={vcardData.email}
                onChange={(e) => setVcardData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company"
                value={vcardData.company}
                onChange={(e) => setVcardData(prev => ({ ...prev, company: e.target.value }))}
                placeholder="Enter company name"
              />
            </Grid>
          </Grid>
        );

      default:
        return (
          <TextField
            fullWidth
            label={qrType === 'url' ? 'URL' : qrType === 'email' ? 'Email Address' : qrType === 'phone' ? 'Phone Number' : 'Text'}
            value={qrValue}
            onChange={(e) => setQrValue(e.target.value)}
            placeholder={
              qrType === 'url' ? 'Enter website URL' :
              qrType === 'email' ? 'Enter email address' :
              qrType === 'phone' ? 'Enter phone number' :
              'Enter text content'
            }
            multiline={qrType === 'text'}
            rows={qrType === 'text' ? 4 : 1}
          />
        );
    }
  };

  const hasValidData = () => {
    switch (qrType) {
      case 'wifi':
        return wifiData.ssid.trim() !== '';
      case 'vcard':
        return vcardData.name.trim() !== '' || vcardData.phone.trim() !== '' || vcardData.email.trim() !== '';
      default:
        return qrValue.trim() !== '';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pl: { md: 35 }, pr: { md: 3 } }}>
      <Box sx={{ mb: 4, textAlign: 'left' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2, textAlign: 'left' }}>
          QR Code Generator
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'left', lineHeight: 1.6 }}>
          Generate QR codes for URLs, text, contact information, WiFi networks, and more. 
          Customize colors, size, and download as PNG.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
                <QrIcon color="primary" />
                QR Code Settings
              </Typography>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>QR Code Type</InputLabel>
                <Select
                  value={qrType}
                  onChange={(e) => setQrType(e.target.value as QRType)}
                >
                  <MenuItem value="url">Website URL</MenuItem>
                  <MenuItem value="text">Text</MenuItem>
                  <MenuItem value="email">Email Address</MenuItem>
                  <MenuItem value="phone">Phone Number</MenuItem>
                  <MenuItem value="wifi">WiFi Network</MenuItem>
                  <MenuItem value="vcard">Contact Card (vCard)</MenuItem>
                </Select>
              </FormControl>

              {renderInputFields()}

              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  QR Code Size: {size}px
                </Typography>
                <Slider
                  value={size}
                  onChange={(_, value) => setSize(value as number)}
                  min={128}
                  max={512}
                  step={32}
                  marks
                  valueLabelDisplay="auto"
                />
              </Box>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Foreground Color"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    InputProps={{
                      style: { height: 56 }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Background Color"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    InputProps={{
                      style: { height: 56 }
                    }}
                  />
                </Grid>
              </Grid>

              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Error Correction Level</InputLabel>
                <Select
                  value={errorCorrection}
                  onChange={(e) => setErrorCorrection(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                >
                  <MenuItem value="L">Low (7%)</MenuItem>
                  <MenuItem value="M">Medium (15%)</MenuItem>
                  <MenuItem value="Q">Quartile (25%)</MenuItem>
                  <MenuItem value="H">High (30%)</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={includeLogo}
                    onChange={(e) => setIncludeLogo(e.target.checked)}
                  />
                }
                label="Include Logo (Coming Soon)"
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 'fit-content' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Generated QR Code
              </Typography>

              <Box sx={{ textAlign: 'center', mb: 3, display: 'flex', justifyContent: 'center' }}>
                {hasValidData() ? (
                  <Paper
                    sx={{
                      p: 3,
                      display: 'inline-block',
                      backgroundColor: bgColor,
                      borderRadius: 3,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    <QRCodeCanvas
                      value={generateQRValue()}
                      size={size}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      level={errorCorrection}
                      includeMargin={true}
                    />
                  </Paper>
                ) : (
                  <Box
                    sx={{
                      width: size,
                      height: size,
                      border: '2px dashed #666',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', px: 2 }}>
                      Enter data to generate QR code
                    </Typography>
                  </Box>
                )}
              </Box>

              {hasValidData() && (
                <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={downloadQR}
                    sx={{ flex: 1 }}
                  >
                    Download PNG
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<CopyIcon />}
                    onClick={copyToClipboard}
                    sx={{ flex: 1 }}
                  >
                    Copy Data
                  </Button>
                </Box>
              )}

              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearAll}
                fullWidth
                sx={{ mt: 1 }}
              >
                Clear All
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            QR Code Types
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Website URL
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Generate QR codes that link directly to websites. Perfect for business cards, 
                flyers, and marketing materials.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                WiFi Network
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create QR codes that automatically connect devices to your WiFi network. 
                No need to manually enter network credentials.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Contact Card (vCard)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Generate QR codes with contact information that can be scanned to add 
                someone to contacts instantly.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Custom Text
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Create QR codes with any text content. Great for sharing messages, 
                instructions, or any information.
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default QrCodeGenerator;
