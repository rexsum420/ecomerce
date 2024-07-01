import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import Api from '../utils/Api';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email)) {
      setError('Invalid email address.');
    } else {
      setError('');
    }
  };

  const validatePassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!re.test(password)) {
      setError('Password must be at least 8 characters long, contain a capital letter, a lower case letter, and a number or symbol.'); 
    } else {
      setError('');
    }
  };

  const handleSignUp = async () => {
    setError('');
    setSuccess('');

    if (error !== '') {
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await Api('http://192.168.1.75:8000/api/users/', 'POST', { username, email, password }, false);
      setSuccess('Sign up successful!');
    } catch (err) {
      setError('Sign up failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h4" gutterBottom>
          Sign Up
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            validatePassword(e.target.value);
          }}
        />
        <TextField
          label="Confirm Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}
        {success && (
          <Typography color="primary" variant="body2" gutterBottom>
            {success}
          </Typography>
        )}
        <Button variant="contained" color="primary" onClick={handleSignUp}>
          Sign Up
        </Button>
      </Box>
    </Container>
  );
};

export default SignUpScreen;
