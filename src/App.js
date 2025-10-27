/* global __app_id */
import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress, Typography, Alert } from '@mui/material'; // Added Alert
import { onAuthStateChanged } from 'firebase/auth';

import { auth, db } from './firebaseConfig';

import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import Weather from './components/Weather';
import Profile from './components/Profile';
import AuthForm from './components/AuthForm';
import ErrorBoundary from './components/ErrorBoundary';

const theme = createTheme({
  palette: {
    primary: { main: '#2D5016', light: '#9CAF88', dark: '#1a3009', contrastText: '#ffffff' },
    secondary: { main: '#D4A574', light: '#e6c496', dark: '#b8935f', contrastText: '#1a3009' },
    background: { default: '#FFF8DC', paper: '#ffffff', },
    success: { main: '#4CAF50', },
    info: { main: '#2196F3', },
    warning: { main: '#CD853F', },
    error: { main: '#B7410E', },
  },
  typography: {
    fontFamily: '"Noto Sans", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Noto Serif", serif', fontWeight: 700, },
    h2: { fontFamily: '"Noto Serif", serif', fontWeight: 700, },
    h3: { fontFamily: '"Noto Serif", serif', fontWeight: 600, },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 25, textTransform: 'none', fontWeight: 500, padding: '8px 20px' }, }, },
    MuiCard: { styleOverrides: { root: { borderRadius: 12, boxShadow: '0 4px 12px rgba(45, 80, 22, 0.1)', transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(45, 80, 22, 0.15)', }, }, }, },
    MuiTabs: { styleOverrides: { indicator: { height: 3 } } },
    MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: 500 } } },
  },
});

const appId = process.env.REACT_APP_FIREBASE_APP_ID || (typeof __app_id !== 'undefined' ? __app_id : 'kisan-seva-local-dev');
console.log("Using App ID:", appId);
if (!appId || appId === 'kisan-seva-local-dev') {
    console.warn("App ID might be using a default or fallback value. Ensure REACT_APP_FIREBASE_APP_ID is set in your .env file.");
}


function App() {
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [language, setLanguage] = useState('en');
  const [userLocation, setUserLocation] = useState('Loading location...');
  const [locationError, setLocationError] = useState(null);

  // Moved missingKeys inside the component
  const missingKeys = ['apiKey', 'authDomain', 'projectId', 'appId'].filter(key => !process.env[`REACT_APP_FIREBASE_${key.toUpperCase()}`]);


  useEffect(() => {
      if (auth && db) {
          console.log("Firebase services are ready.");
          setFirebaseReady(true);
      } else {
          console.error("Firebase services failed to initialize. Check firebaseConfig.js and environment variables.");
          setFirebaseReady(false); // Should already be false, but explicit
      }
  }, []);

  useEffect(() => {
    if (!firebaseReady) {
        setAuthChecked(true); // Mark as checked even if Firebase isn't ready, to move past initial load screen
        return;
    }

    console.log("Setting up Firebase Auth listener...");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("App.js Auth state changed:", user ? `User UID: ${user.uid}, Anonymous: ${user.isAnonymous}` : "No user");
      setCurrentUser(user);
      setAuthChecked(true);
    }, (error) => {
      console.error("Auth state listener error:", error);
      setCurrentUser(null);
      setAuthChecked(true);
    });

    return () => {
        console.log("Cleaning up Firebase Auth listener...");
        unsubscribe();
    }
  }, [firebaseReady]);

  const languages = {
    en: { name: 'English', flag: '🇺🇸', },
    hi: { name: 'हिन्दी', flag: '🇮🇳', },
    mr: { name: 'मराठी', flag: '🇮🇳', },
    te: { name: 'తెలుగు', flag: '🇮🇳', },
  };

  const translations = {
    en: { appName: 'Kisan Seva', tagline: 'Your Digital Farming Companion', dashboard: 'Dashboard', marketplace: 'Marketplace', weather: 'Weather', profile: 'Profile', home: 'Home', },
    hi: { appName: 'किसान सेवा', tagline: 'आपका डिजिटल खेती साथी', dashboard: 'डैशबोर्ड', marketplace: 'बाजार', weather: 'मौसम', profile: 'प्रोफाइल', home: 'होम', },
    mr: { appName: 'किसान सेवा', tagline: 'तुमचा डिजिटल शेती साथीदार', dashboard: 'डॅशबोर्ड', marketplace: 'बाजार', weather: 'हवामान', profile: 'प्रोफाइल', home: 'होम', },
    te: { appName: 'కిసాన్ సేవా', tagline: 'మీ డిజిటల్ వ్యవసాయ భాగస్వామి', dashboard: 'డాష్‌బోర్డ్', marketplace: 'మార్కెట్', weather: 'వాతావరణం', profile: 'ప్రొఫైల్', home: 'హోమ్', },
  };

  const currentTranslations = translations[language];

  // Using useCallback for fetchLocation to potentially stabilize references if needed elsewhere
  const fetchLocation = useCallback(() => {
    let isMounted = true;
    setLocationError(null);

    if (!navigator.geolocation) {
      if (isMounted) {
        console.log("Geolocation is not supported by this browser.");
        setUserLocation('Nashik, MH (Default)');
        setLocationError('Geolocation not supported.');
      }
      return () => { isMounted = false; }; // Return cleanup for consistency
    }

    const handlePosition = async (position) => {
      if (isMounted) {
        console.log("Geolocation Position:", position.coords);
        try {
          // --- TODO: Replace with actual reverse geocoding API call ---
          if (position.coords.latitude > 19 && position.coords.latitude < 21 && position.coords.longitude > 73 && position.coords.longitude < 75) {
            setUserLocation('Nashik, MH');
          } else {
            setUserLocation('Detected Location (Unknown Name)');
          }
          setLocationError(null);
          // --- End TODO ---
        } catch (geocodeError) {
          console.error("Reverse geocoding failed:", geocodeError);
          setUserLocation('Nashik, MH (Default)');
          setLocationError('Could not determine location name.');
        }
      }
    };

    const handleError = (error) => {
      if (isMounted) {
        console.warn('Geolocation error:', error.message);
        setUserLocation('Nashik, MH (Default)');
        setLocationError(`Geolocation failed: ${error.message}`);
      }
    };

    navigator.geolocation.getCurrentPosition(
      handlePosition,
      handleError,
      { timeout: 10000, enableHighAccuracy: false }
    );

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array means this useCallback instance is stable

  useEffect(() => {
    const cleanup = fetchLocation();
    return cleanup;
  }, [fetchLocation]);


  if (!firebaseReady || !authChecked) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: theme.palette.background.default }}>
        <CircularProgress color="primary" />
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
          { !firebaseReady ? "Initializing..." : "Checking authentication..." }
        </Typography>
        {/* Check missingKeys here */}
        { !firebaseReady && missingKeys && missingKeys.length > 0 && (
             <Typography sx={{ mt: 1, color: 'error.main', fontSize: '0.8rem', textAlign: 'center', maxWidth: '80%' }}>
                 Firebase configuration might be missing. Check console and .env file.
             </Typography>
         )}
      </Box>
    );
  }

  if (!auth || !db) {
     return (
       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', p: 3, textAlign: 'center' }}>
         <Typography color="error" variant="h6">
           Failed to initialize Firebase. Please check the configuration and console for errors. The app cannot continue.
         </Typography>
       </Box>
     );
  }

  if (!currentUser) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthForm auth={auth} db={db} appId={appId} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Box sx={{ pb: 8 }}>
           {locationError && ( // Display location error if present
                <Alert severity="warning" sx={{ m: 1 }}>
                    {locationError} Using default location.
                </Alert>
            )}
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    language={language}
                    setLanguage={setLanguage}
                    translations={currentTranslations}
                    languages={languages}
                    userLocation={userLocation}
                    currentUser={currentUser}
                    db={db}
                    appId={appId}
                  />
                }
              />
              <Route
                path="/marketplace"
                element={
                  <Marketplace
                    language={language}
                    translations={currentTranslations}
                    userLocation={userLocation}
                    currentUser={currentUser}
                    db={db}
                    appId={appId}
                  />
                }
              />
              <Route
                path="/weather"
                element={
                  <Weather
                    language={language}
                    translations={currentTranslations}
                    userLocation={userLocation}
                    currentUser={currentUser} // Pass currentUser
                    db={db} // Pass db
                    appId={appId} // Pass appId
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <Profile
                    language={language}
                    translations={currentTranslations}
                    userLocation={userLocation}
                    currentUser={currentUser}
                    db={db}
                    appId={appId}
                    auth={auth}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Navigation
              language={language}
              translations={currentTranslations}
            />
          </Box>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;