import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Stack, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const AddShipping = () => {
    const [name, setName] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const toast = useToast();
    const token = localStorage.getItem('token');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newAddress = {
            name,
            address1,
            address2,
            city,
            state,
            zip,
            phone,
            email,
        };

        try {
            const response = await fetch(`http://192.168.1.75:8000/api/shipping/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newAddress)
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
            <form onSubmit={handleSubmit}>
                <Stack spacing={4}>
                    <FormControl isRequired>
                        <FormLabel>Name</FormLabel>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Address 1</FormLabel>
                        <Input value={address1} onChange={(e) => setAddress1(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Address 2</FormLabel>
                        <Input value={address2} onChange={(e) => setAddress2(e.target.value)} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>City</FormLabel>
                        <Input value={city} onChange={(e) => setCity(e.target.value)} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>State</FormLabel>
                        <Input value={state} onChange={(e) => setState(e.target.value)} />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Zip Code</FormLabel>
                        <Input value={zip} onChange={(e) => setZip(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Phone</FormLabel>
                        <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
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