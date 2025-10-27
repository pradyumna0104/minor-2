import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components
const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderTop: '1px solid #9CAF88',
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 1000,
}));

const StyledBottomNavigationAction = styled(BottomNavigationAction)(({ theme }) => ({
  '&.Mui-selected': {
    color: theme.palette.primary.main,
  },
  '&:not(.Mui-selected)': {
    color: theme.palette.grey[500],
  },
}));

function Navigation({ language, translations }) {
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentValue = () => {
    switch (location.pathname) {
      case '/':
        return 0;
      case '/marketplace':
        return 1;
      case '/weather':
        return 2;
      case '/profile':
        return 3;
      default:
        return 0;
    }
  };

  const handleNavigation = (event, newValue) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/marketplace');
        break;
      case 2:
        navigate('/weather');
        break;
      case 3:
        navigate('/profile');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <Paper elevation={3} sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
      <StyledBottomNavigation value={getCurrentValue()} onChange={handleNavigation}>
        <StyledBottomNavigationAction 
          label={translations.home} 
          icon={<span style={{ fontSize: '1.5rem' }}>🏠</span>} 
        />
        <StyledBottomNavigationAction 
          label={translations.marketplace} 
          icon={<span style={{ fontSize: '1.5rem' }}>🏪</span>} 
        />
        <StyledBottomNavigationAction 
          label={translations.weather} 
          icon={<span style={{ fontSize: '1.5rem' }}>🌦️</span>} 
        />
        <StyledBottomNavigationAction 
          label={translations.profile} 
          icon={<span style={{ fontSize: '1.5rem' }}>👤</span>} 
        />
      </StyledBottomNavigation>
    </Paper>
  );
}

export default Navigation;