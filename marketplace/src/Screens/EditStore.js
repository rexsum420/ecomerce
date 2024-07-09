import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
} from "@chakra-ui/react";

const EditStore = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [website, setWebsite] = useState('');
    const [phone, setPhone] = useState('');
    const [storeList, setStoreList] = useState([]);
    const [nameError, setNameError] = useState('');
    const { storeId } = useParams();
    const [store, setStore] = useState({});
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchStore = async () => {
            const response = await fetch(`http://192.168.1.75:8000/api/stores/${storeId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            });
            const data = await response.json();
            setStore(data);
            setName(data.name);
            setDescription(data.description);
            setWebsite(data.website);
            setPhone(data.phone);
        };
        fetchStore();
    }, [storeId, token]);

    useEffect(() => {
        const fetchStoreList = async () => {
            const response = await fetch('http://192.168.1.75:8000/api/get-store/?list=True');

            if (response.ok) {
                const data = await response.json();
                const filteredStoreList = data.filter(s => s.id !== parseInt(storeId));
                setStoreList(filteredStoreList);
            }
        };

        fetchStoreList();
    }, [storeId]);

    const handleNameChange = (e) => {
        const newName = e.target.value;
        setName(newName);

        const storeExists = storeList.some(store => store.name.toLowerCase() === newName.toLowerCase());

        if (storeExists) {
            setNameError('Store name already exists. Please choose a different name.');
        } else {
            setNameError('');
        }
    };

    const handleSave = async () => {
        const response = await fetch(`http://192.168.1.75:8000/api/stores/${storeId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                name,
                description,
                website,
                phone
            })
        });

        if (response.ok) {
            const updatedStore = await response.json();
            setStore(updatedStore);
            alert('Store updated successfully');
            document.location.href = `http://localhost:3000/store/${storeId}`
        } else {
            alert('Failed to update store');
        }
    };

    return (
        <Box maxW="600px" mx="auto" mt={10} p={5} borderWidth="1px" borderRadius="lg" boxShadow="md">
            <Heading as="h2" size="lg" mb={6} textAlign="center">
                Edit Store
            </Heading>
            <VStack spacing={4}>
                <FormControl id="name" isRequired>
                    <FormLabel>Store Name</FormLabel>
                    <Input
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Enter store name"
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
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter store description"
                    />
                </FormControl>
                <FormControl id="website">
                    <FormLabel>Website</FormLabel>
                    <Input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="Enter store website"
                    />
                </FormControl>
                <FormControl id="phone">
                    <FormLabel>Phone</FormLabel>
                    <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter store phone"
                    />
                </FormControl>
                <Button colorScheme="blue" onClick={handleSave} width="full">
                    Save
                </Button>
            </VStack>
        </Box>
    );
};

export default EditStore;
