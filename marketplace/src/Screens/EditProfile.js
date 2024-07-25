import React, { useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Heading, useToast } from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';

const EditProfile = () => {
  const { register, handleSubmit, setValue, control, formState: { errors } } = useForm();
  const toast = useToast();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      const username = localStorage.getItem('username');
      try {
        const response = await fetch(`${apiBaseUrl}/api/profiles/?user=${username}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const profileData = data.results[0];
          for (const key in profileData) {
            setValue(key, profileData[key]);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [apiBaseUrl, setValue]);

  const onSubmit = async (profile) => {
    const username = localStorage.getItem('username');
    try {
      const response = await fetch(`${apiBaseUrl}/api/profiles/${username}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        toast({
          title: 'Profile updated.',
          description: 'Your profile has been updated successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to update profile.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={5} borderWidth={1} borderRadius="lg" boxShadow="lg">
      <Heading as="h1" size="lg" mb={6}>Edit Profile</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Controller
            name="email"
            control={control}
            render={({ field }) => <Input type="email" {...field} />}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>First Name</FormLabel>
          <Controller
            name="first_name"
            control={control}
            render={({ field }) => <Input type="text" {...field} />}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Last Name</FormLabel>
          <Controller
            name="last_name"
            control={control}
            render={({ field }) => <Input type="text" {...field} />}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Phone Number</FormLabel>
          <Controller
            name="phone_number"
            control={control}
            render={({ field }) => <Input type="tel" {...field} />}
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" width="full">Save</Button>
      </form>
    </Box>
  );
};

export default EditProfile;
