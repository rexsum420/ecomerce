import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    VStack,
    Heading,
    Alert,
    AlertIcon,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';

const EditStore = () => {
    const { storeId } = useParams();
    const [storeList, setStoreList] = useState([]);
    const [nameError, setNameError] = useState('');
    const token = localStorage.getItem('token');
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const baseUrl = process.env.REACT_APP_BASE_URL;

    const { handleSubmit, setValue, control, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchStore = async () => {
            const response = await fetch(`${apiBaseUrl}/api/stores/${storeId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
            });
            const data = await response.json();
            setValue('name', data.name);
            setValue('description', data.description);
            setValue('website', data.website);
            setValue('phone', data.phone);
        };
        fetchStore();
    }, [storeId, token, setValue]);

    useEffect(() => {
        const fetchStoreList = async () => {
            const response = await fetch(`${apiBaseUrl}/api/get-store/?list=True`);
            if (response.ok) {
                const data = await response.json();
                const filteredStoreList = data.filter((s) => s.id !== parseInt(storeId));
                setStoreList(filteredStoreList);
            }
        };
        fetchStoreList();
    }, [storeId, apiBaseUrl]);

    const handleNameChange = (name) => {
        const storeExists = storeList.some((store) => store.name.toLowerCase() === name.toLowerCase());
        if (storeExists) {
            setNameError('Store name already exists. Please choose a different name.');
        } else {
            setNameError('');
        }
    };

    const onSubmit = async (data) => {
        const response = await fetch(`${apiBaseUrl}/api/stores/${storeId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const updatedStore = await response.json();
            alert('Store updated successfully');
            document.location.href = `${baseUrl}/store/${storeId}`;
        } else {
            alert('Failed to update store');
        }
    };

    return (
        <Box maxW="600px" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Heading as="h2" size="lg" mb={6} textAlign="center">
                Edit Store
            </Heading>
            <VStack spacing={4} as="form" onSubmit={handleSubmit(onSubmit)}>
                <FormControl id="name" isRequired>
                    <FormLabel>Store Name</FormLabel>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                {...field}
                                placeholder="Enter store name"
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleNameChange(e.target.value);
                                }}
                            />
                        )}
                    />
                    {nameError && (
                        <Alert status="error" mt={2}>
                            <AlertIcon />
                            {nameError}
                        </Alert>
                    )}
                </FormControl>
                <FormControl id="description">
                    <FormLabel>Description</FormLabel>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <Textarea {...field} placeholder="Enter store description" />
                        )}
                    />
                </FormControl>
                <FormControl id="website">
                    <FormLabel>Website</FormLabel>
                    <Controller
                        name="website"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} type="url" placeholder="Enter store website" />
                        )}
                    />
                </FormControl>
                <FormControl id="phone">
                    <FormLabel>Phone</FormLabel>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input {...field} type="tel" placeholder="Enter store phone" />
                        )}
                    />
                </FormControl>
                <Button colorScheme="blue" type="submit" width="full">
                    Save
                </Button>
            </VStack>
        </Box>
    );
};

export default EditStore;
