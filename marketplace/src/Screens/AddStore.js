import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    FormErrorMessage,
} from '@chakra-ui/react';

const AddStore = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [storeList, setStoreList] = useState([]);
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        const fetchStoreList = async () => {
            const response = await fetch('http://192.168.1.75:8000/api/get-store/?list=True');
            if (response.ok) {
                const data = await response.json();
                setStoreList(data);
            }
        };

        fetchStoreList();
    }, []);

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);

        // Check if the store name already exists
        const storeExists = storeList.some(store => store.name.toLowerCase() === newName.toLowerCase());

        if (storeExists) {
            setNameError('Store name already exists. Please choose a different name.');
        } else {
            setNameError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nameError) return;

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
            })
        });

        if (response.ok) {
            // Reset form fields
            setName('');
            setDescription('');
            setStoreList([...storeList, { name }]); // Add new store to the list
        } else {
            const errorData = await response.json();
            setNameError(errorData.detail || 'An error occurred while creating the store.');
        }
    };

    return (
        <Box p={5} maxW="500px" mx="auto" boxShadow="lg" borderRadius="md" bg="transparent" mt={8}>
            <form onSubmit={handleSubmit}>
                <FormControl id="name" mb={4} isInvalid={nameError}>
                    <FormLabel>Store Name</FormLabel>
                    <Input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Enter store name"
                        size="lg"
                    />
                    {nameError && <FormErrorMessage>{nameError}</FormErrorMessage>}
                </FormControl>
                <FormControl id="description" mb={4}>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter store description"
                        size="lg"
                    />
                </FormControl>
                <Button
                    type="submit"
                    colorScheme="blue"
                    isFullWidth
                    size="lg"
                    mt={4}
                    disabled={nameError}
                >
                    Add Store
                </Button>
            </form>
        </Box>
    );
};

export default AddStore;
