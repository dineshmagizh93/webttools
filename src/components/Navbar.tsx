import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
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
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = [
  { text: 'Home', path: '/', icon: <HomeIcon /> },
  { text: 'PDF Compressor', path: '/pdf-compressor', icon: <PdfIcon /> },
  { text: 'JPG to PDF', path: '/jpg-to-pdf', icon: <ImageIcon /> },
  { text: 'QR Generator', path: '/qr-generator', icon: <QrIcon /> },
  { text: 'Image Compressor', path: '/image-compressor', icon: <CompressIcon /> },
  { text: 'Word Counter', path: '/word-counter', icon: <TextIcon /> },
  { text: 'Text to Speech', path: '/text-to-speech', icon: <VolumeIcon /> },
  { text: 'Speech to Text', path: '/speech-to-text', icon: <MicIcon /> },
  { text: 'Remove Background', path: '/remove-background', icon: <RemoveIcon /> },
  { text: 'Password Generator', path: '/password-generator', icon: <LockIcon /> },
  { text: 'Stopwatch & Timer', path: '/stopwatch-timer', icon: <TimerIcon /> },
  { text: 'PDF Split', path: '/pdf-split', icon: <SplitIcon /> },
  { text: 'PDF to JPG', path: '/pdf-to-jpg', icon: <CameraIcon /> },
  { text: 'JPG to PNG', path: '/jpg-to-png', icon: <ImageIcon /> },
  { text: 'HTML to PDF', path: '/html-to-pdf', icon: <CodeIcon /> },
  { text: 'Meta Tag Generator', path: '/meta-tag-generator', icon: <TagIcon /> },
  { text: 'UTM Link Builder', path: '/utm-link-builder', icon: <LinkIcon /> },
  { text: 'JSON Formatter', path: '/json-formatter', icon: <JsonIcon /> },
  { text: 'Base64 Converter', path: '/base64-converter', icon: <Base64Icon /> },
  { text: 'Color Picker', path: '/color-picker', icon: <ColorIcon /> },
  { text: 'Online Notepad', path: '/online-notepad', icon: <NotepadIcon /> },
];

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #333' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Web Tools
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              backgroundColor: location.pathname === item.path ? 'rgba(144, 202, 249, 0.1)' : 'transparent',
              borderRight: location.pathname === item.path ? '3px solid #90caf9' : 'none',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
          borderBottom: '1px solid #333',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #90caf9, #f48fb1)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Web Tools
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              width: 280,
              background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%)',
              borderRight: '1px solid #333',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              width: 280,
              background: 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%)',
              borderRight: '1px solid #333',
              boxSizing: 'border-box',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
};

export default Navbar;
