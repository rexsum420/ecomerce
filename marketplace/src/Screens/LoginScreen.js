import React, { useState } from 'react';
import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Text,
} from '@chakra-ui/react';
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
      localStorage.setItem('username', username)
      navigate('/');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <Container maxW="sm">
      <Box
        mt={8}
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading as="h2" size="xl" mb={6} textAlign="center">
          Login
        </Heading>
        <FormControl mb={4}>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            variant="filled"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        {error && (
          <Text color="red.500" mb={4}>
            {error}
          </Text>
        )}
        <Button colorScheme="blue" onClick={handleLogin} mb={4} w="100%">
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default LoginScreen;
