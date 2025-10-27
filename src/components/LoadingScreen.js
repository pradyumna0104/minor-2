import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import anime from 'animejs';

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #F5DEB3 0%, #FFF8DC 100%)',
}));

const LoadingPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  border: '1px solid #9CAF88',
  borderRadius: 16,
  maxWidth: 400,
}));

function LoadingScreen({ language, translations }) {
  const messages = {
    en: [
      'Connecting to farm data...',
      'Loading weather forecasts...',
      'Fetching market prices...',
      'Preparing your dashboard...',
    ],
    hi: [
      'फार्म डेटा से कनेक्ट कर रहा है...',
      'मौसम पूर्वानुमान लोड हो रहा है...',
      'बाजार कीमतें प्राप्त की जा रही हैं...',
      'आपका डैशबोर्ड तैयार किया जा रहा है...',
    ],
    mr: [
      'शेती डेटा कनेक्ट करत आहे...',
      'हवामान अंदाज लोड होत आहे...',
      'बाजार दर मिळवत आहे...',
      'तुमचा डॅशबोर्ड तयार करत आहे...',
    ],
    te: [
      'ఫార్మ్ డేటాతో కనెక్ట్ అవుతోంది...',
      'వాతావరణ అంచనాలు లోడ్ అవుతున్నాయి...',
      'మార్కెట్ ధరలు పొందుతోంది...',
      'మీ డాష్‌బోర్డ్ సిద్ధం చేస్తోంది...',
    ],
  };

  const currentMessages = messages[language] || messages.en;
  const currentTranslations = translations[language] || translations.en;

  useEffect(() => {
    // Animate loading elements
    anime({
      targets: '.loading-icon',
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutElastic(1, .8)',
    });

    anime({
      targets: '.loading-text',
      translateY: [20, 0],
      opacity: [0, 1],
      delay: 300,
      duration: 600,
      easing: 'easeOutExpo',
    });

    // Animate progress dots
    anime({
      targets: '.loading-dots span',
      scale: [0, 1],
      opacity: [0, 1],
      delay: anime.stagger(200, {start: 600}),
      duration: 400,
      easing: 'easeOutExpo',
    });

    // Rotate loading animation
    anime({
      targets: '.loading-rotate',
      rotate: 360,
      duration: 2000,
      loop: true,
      easing: 'linear',
    });
  }, []);

  return (
    <LoadingContainer>
      <LoadingPaper elevation={3}>
        <Box className="loading-icon" sx={{ mb: 3 }}>
          <Typography variant="h1" sx={{ fontSize: '4rem', color: '#2D5016' }}>
            🌾
          </Typography>
        </Box>
        
        <Typography variant="h4" sx={{ mb: 2, color: '#2D5016', fontWeight: 'bold' }}>
          {currentTranslations.appName}
        </Typography>
        
        <Typography variant="h6" sx={{ mb: 4, color: '#666' }}>
          {currentTranslations.tagline}
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <CircularProgress 
            size={60} 
            sx={{ 
              color: '#2D5016',
              animation: 'loading-rotate 2s linear infinite',
            }} 
          />
        </Box>
        
        <Box className="loading-text" sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
            {currentMessages[0]}
          </Typography>
          
          <Box className="loading-dots" sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <span style={{ display: 'inline-block', width: 8, height: 8, backgroundColor: '#2D5016', borderRadius: '50%' }}></span>
            <span style={{ display: 'inline-block', width: 8, height: 8, backgroundColor: '#9CAF88', borderRadius: '50%' }}></span>
            <span style={{ display: 'inline-block', width: 8, height: 8, backgroundColor: '#D4A574', borderRadius: '50%' }}></span>
          </Box>
        </Box>
        
        <Typography variant="caption" sx={{ color: '#999' }}>
          Powered by modern farming technology
        </Typography>
      </LoadingPaper>
    </LoadingContainer>
  );
}

export default LoadingScreen;