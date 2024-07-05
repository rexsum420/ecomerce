import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, useToast } from '@chakra-ui/react';

const AddStore = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [phone, setPhone] = useState('');
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://192.168.1.75:8000/api/stores/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
                description,
                website,
                phone
            })
        });

        if (response.ok) {
            toast({
                title: "Store created.",
                description: "Your store has been created successfully.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            // Reset form fields
            setName('');
            setDescription('');
            setWebsite('');
            setPhone('');
        } else {
            const errorData = await response.json();
            toast({
                title: "Error creating store.",
                description: errorData.detail || "An error occurred while creating the store.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box p={5} maxW="500px" mx="auto">
            <form onSubmit={handleSubmit}>
                <FormControl id="name" mb={4} isRequired>
                    <FormLabel>Store Name</FormLabel>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormControl>
                <FormControl id="description" mb={4}>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </FormControl>
                <FormControl id="website" mb={4}>
                    <FormLabel>Website</FormLabel>
                    <Input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                    />
                </FormControl>
                <FormControl id="phone" mb={4}>
                    <FormLabel>Phone</FormLabel>
                    <Input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </FormControl>
                <Button type="submit" colorScheme="blue" isFullWidth>
                    Add Store
                </Button>
            </form>
        </Box>
    );
};

export default AddStore;