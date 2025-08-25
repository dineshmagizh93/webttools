import React, { useEffect, useRef } from 'react';
import { Box, Paper, Typography } from '@mui/material';

interface GoogleAdProps {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'banner';
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAd: React.FC<GoogleAdProps> = ({
  adSlot,
  adFormat = 'auto',
  style = {},
  className = '',
  responsive = true,
}) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // Push the ad to Google AdSense
      if (window.adsbygoogle && adRef.current) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.warn('AdSense error:', error);
    }
  }, [adSlot]);

  const getAdStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      display: 'block',
      textAlign: 'center',
      overflow: 'hidden',
      ...style,
    };

    if (responsive) {
      baseStyle.minHeight = '100px';
    }

    return baseStyle;
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Box sx={{ mb: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          Advertisement
        </Typography>
      </Box>
      <Box
        ref={adRef}
        className={`adsbygoogle ${className}`}
        style={getAdStyle()}
        data-ad-client="ca-pub-8975115432793623"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive}
      />
    </Paper>
  );
};

export default GoogleAd;
