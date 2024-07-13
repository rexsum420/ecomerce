import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Heading,
  useToast,
} from '@chakra-ui/react';

const EditProfile = () => {
  const [profile, setProfile] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
  });

  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      const username = localStorage.getItem('username');
      try {
        const response = await fetch(`http://192.168.1.75:8000/api/profiles/?user=${username}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const profileData = data.results[0];
          setProfile({
            email: profileData.email,
            first_name: profileData.first_name,
            last_name: profileData.last_name,
            phone_number: profileData.phone_number,
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username');
    try {
      const response = await fetch(`http://192.168.1.75:8000/api/profiles/${username}/`, {
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
      <form onSubmit={handleSubmit}>
        <FormControl mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>First Name</FormLabel>
          <Input
            type="text"
            name="first_name"
            value={profile.first_name}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Last Name</FormLabel>
          <Input
            type="text"
            name="last_name"
            value={profile.last_name}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl mb={4}>
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="tel"
            name="phone_number"
            value={profile.phone_number || ''}
            onChange={handleChange}
          />
        </FormControl>
        <Button type="submit" colorScheme="teal" width="full">Save</Button>
      </form>
    </Box>
  );
};

export default EditProfile;