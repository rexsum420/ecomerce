import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const AddShipping = () => {
    const { register, handleSubmit } = useForm({
        defaultValues: {
            name: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            zip: '',
            phone: '',
            email: ''
        }
    });
    const navigate = useNavigate();
    const toast = useToast();
    const token = localStorage.getItem('token');
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`${apiBaseUrl}/api/shipping/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                toast({
                    title: 'Address added.',
                    description: 'Your shipping address has been added successfully.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/checkout');
            } else {
                const errorData = await response.json();
                toast({
                    title: 'Error adding address.',
                    description: errorData.detail || 'Something went wrong.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error adding address.',
                description: 'An unexpected error occurred.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box 
            p={5}
            width={["100%", "100%", "50%", "33.33%"]}
            mx="auto"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input {...register('name')} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Address 1</FormLabel>
                        <Input {...register('address1')} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Address 2</FormLabel>
                        <Input {...register('address2')} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>City</FormLabel>
                        <Input {...register('city')} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>State</FormLabel>
                        <Input {...register('state')} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Zip Code</FormLabel>
                        <Input {...register('zip')} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Phone</FormLabel>
                        <Input {...register('phone')} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input {...register('email')} />
                    </FormControl>
                    <Button type="submit" colorScheme="blue" mt={4}>
                        Add Address
                    </Button>
                </Stack>
            </form>
        </Box>
    );
};

export default AddShipping;
