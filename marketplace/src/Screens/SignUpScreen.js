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

const SignUpScreen = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const password = watch('password');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await Api(`${apiBaseUrl}/api/users/`, 'POST', data, false);
      alert('Sign up successful!');
    } catch (err) {
      alert('Sign up failed. Please try again.');
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
          <FormControl mb={4} isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              variant="filled"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Invalid email address',
                },
              })}
            />
            {errors.email && (
              <Text color="red.500" mt={2}>{errors.email.message}</Text>
            )}
          </FormControl>
          <FormControl mb={4} isInvalid={errors.password}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              variant="filled"
              {...register('password', {
                required: 'Password is required',
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                  message: 'Password must be at least 8 characters long, contain a capital letter, a lower case letter, and a number or symbol.',
                },
              })}
            />
            {errors.password && (
              <Text color="red.500" mt={2}>{errors.password.message}</Text>
            )}
          </FormControl>
          <FormControl mb={4} isInvalid={errors.confirmPassword}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              variant="filled"
              {...register('confirmPassword', {
                validate: value => value === password || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && (
              <Text color="red.500" mt={2}>{errors.confirmPassword.message}</Text>
            )}
          </FormControl>
          {errors.submit && (
            <Text color="red.500" mb={4}>{errors.submit.message}</Text>
          )}
          <Button colorScheme="blue" type="submit" mb={4} w="100%">
            Sign Up
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default SignUpScreen;
