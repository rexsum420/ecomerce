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
    <Container maxW="sm">
      <Box
        mt={8}
        p={6}
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading as="h2" size="xl" mb={6} textAlign="center">
          Sign Up
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
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            variant="filled"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            variant="filled"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validatePassword(e.target.value);
            }}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            variant="filled"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FormControl>
        {error && (
          <Text color="red.500" mb={4}>
            {error}
          </Text>
        )}
        {success && (
          <Text color="green.500" mb={4}>
            {success}
          </Text>
        )}
        <Button colorScheme="blue" onClick={handleSignUp} mb={4} w="100%">
          Sign Up
        </Button>
      </Box>
    </Container>
  );
};

export default SignUpScreen;
