import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import Api from '../utils/Api';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    try {
      const response = await Api('http://192.168.1.75:8000/auth/', 'POST', { username, password }, false);
      localStorage.setItem('token', response.token);
      navigate('/');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h4" gutterBottom>
          Login
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
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography color="error" variant="body2" gutterBottom>
            {error}
          </Typography>
        )}
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default LoginScreen;