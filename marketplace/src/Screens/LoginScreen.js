import React from 'react';
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
import { useForm } from 'react-hook-form';
import Api from '../utils/Api';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const onSubmit = async (data) => {
    try {
      const response = await Api(`${apiBaseUrl}/auth/`, 'POST', data, false);
      localStorage.setItem('token', response.token);
      localStorage.setItem('username', data.username);
      navigate('/');
      document.location.reload();
    } catch (err) {
      alert('Login failed. Please check your credentials.');
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl mb={4} isInvalid={errors.username}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              variant="filled"
              {...register('username', { required: 'Username is required' })}
            />
            {errors.username && (
              <Text color="red.500" mt={2}>{errors.username.message}</Text>
            )}
          </FormControl>
          <FormControl mb={4} isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              variant="filled"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <Text color="red.500" mt={2}>{errors.password.message}</Text>
            )}
          </FormControl>
          <Button colorScheme="blue" type="submit" mb={4} w="100%">
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default LoginScreen;
