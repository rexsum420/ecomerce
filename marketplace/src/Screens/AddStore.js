import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    FormErrorMessage,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';

const AddStore = () => {
    const { register, handleSubmit, control, setError, clearErrors, formState: { errors }, reset } = useForm();
    const [storeList, setStoreList] = useState([]);
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        const fetchStoreList = async () => {
            const response = await fetch(`${apiBaseUrl}/api/get-store/?list=True`);
            if (response.ok) {
                const data = await response.json();
                setStoreList(data);
            }
        };

        fetchStoreList();
    }, [apiBaseUrl]);

    const onSubmit = async (data) => {
        if (errors.name) return;

        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/api/stores/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            reset();
            setStoreList([...storeList, { name: data.name }]);
        } else {
            const errorData = await response.json();
            setError('name', { type: 'manual', message: errorData.detail || 'An error occurred while creating the store.' });
        }
    };

    const handleNameChange = (e) => {
        const newName = e.target.value;
        const storeExists = storeList.some(store => store.name.toLowerCase() === newName.toLowerCase());

        if (storeExists) {
            setError('name', { type: 'manual', message: 'Store name already exists. Please choose a different name.' });
        } else {
            clearErrors('name');
        }
    };

    return (
        <Box p={5} maxW="500px" mx="auto" boxShadow="lg" borderRadius="md" bg="transparent" mt={8}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl id="name" mb={4} isInvalid={errors.name}>
                    <FormLabel>Store Name</FormLabel>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: 'Store name is required.' }}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type="text"
                                onChange={(e) => {
                                    field.onChange(e);
                                    handleNameChange(e);
                                }}
                                placeholder="Enter store name"
                                size="lg"
                            />
                        )}
                    />
                    {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
                </FormControl>
                <FormControl id="description" mb={4}>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                        {...register('description')}
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
                    disabled={Boolean(errors.name)}
                >
                    Add Store
                </Button>
            </form>
        </Box>
    );
};

export default AddStore;
