// src/components/AuthForm.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  Box, Button, TextField, Typography, Container, Paper, Tabs, Tab, Alert, CircularProgress
} from '@mui/material';

// Receive auth, db, appId as props
function AuthForm({ auth, db, appId }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('farmer'); // Default role for signup
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic email/password validation
    if (!email || !password) {
        setError("Email and password cannot be empty.");
        setLoading(false);
        return;
    }
     if (!/\S+@\S+\.\S+/.test(email)) {
        setError("Please enter a valid email address.");
        setLoading(false);
        return;
    }
    if (!isLogin && password.length < 6) {
        setError("Password must be at least 6 characters long for sign up.");
         setLoading(false);
         return;
    }


    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        // Login successful, App.js onAuthStateChanged will handle the redirect/state update
        console.log("Login successful");
      } else {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("Sign up successful, user UID:", user.uid);

        // Store user role and basic info in Firestore
        // Private user data path: /artifacts/{appId}/users/{userId}/userData/profile
        // Ensure this path matches your Firestore security rules for private user data
        const userDocRef = doc(db, `artifacts/${appId}/users/${user.uid}/userData/profile`);
        console.log(" Firestore user doc path:", userDocRef.path);

        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          role: role, // 'farmer' or 'buyer'
          createdAt: serverTimestamp(),
          // Initialize empty profile fields
          name: '',
          location: '',
          farmSize: '',
          phone: '',
          avatar: role === 'farmer' ? '👨‍🌾' : '🛒', // Default avatar based on role
        });
        console.log("User data stored in Firestore");
        // Signup successful, App.js onAuthStateChanged will handle the state update
      }
    } catch (err) {
      console.error("Authentication error details:", err);
      // Provide more user-friendly error messages
      let friendlyMessage = 'Authentication failed. Please check your credentials or try again.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
          friendlyMessage = 'Incorrect email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
          friendlyMessage = 'This email address is already registered. Please login or use a different email.';
      } else if (err.code === 'auth/weak-password') {
          friendlyMessage = 'Password is too weak. It must be at least 6 characters long.';
      } else if (err.code === 'auth/invalid-email') {
          friendlyMessage = 'Please enter a valid email address.';
      }
      setError(friendlyMessage);
    } finally {
        setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setIsLogin(newValue === 0);
    setError(''); // Clear error on tab switch
    setEmail(''); // Clear fields on tab switch
    setPassword('');
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ marginTop: 8, padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          🌾 Kisan Seva
        </Typography>
        <Tabs value={isLogin ? 0 : 1} onChange={handleTabChange} centered sx={{ mb: 3 }} indicatorColor="primary" textColor="primary">
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>
        <Box component="form" onSubmit={handleAuth} sx={{ mt: 1, width: '100%' }}>
          {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email" // Use type email for better validation
            autoComplete="email"
            autoFocus={isLogin} // Autofocus on login tab
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          {!isLogin && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="body2" gutterBottom align="center">Sign up as:</Typography>
              <Tabs
                value={role}
                onChange={(e, newValue) => setRole(newValue)}
                indicatorColor="secondary" // Use secondary color for role selection
                textColor="secondary"
                variant="fullWidth"
                centered
              >
                <Tab label="👨‍🌾 Farmer" value="farmer" />
                <Tab label="🛒 Buyer" value="buyer" />
              </Tabs>
            </Box>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary" // Ensure consistent primary color
            sx={{ mt: 3, mb: 2, py: 1.5 }} // Add padding
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default AuthForm;