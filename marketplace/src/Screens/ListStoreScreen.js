import React from "react";
import { useEffect, useState } from "react";
import { Box, SimpleGrid, Spinner, Alert, AlertIcon, Heading, Button, Center } from "@chakra-ui/react";
import Api from "../utils/Api";
import { useNavigate } from "react-router-dom";

const ListStoreScreen = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const fetchStores = async () => {
        try {
            const response = await Api(`${apiBaseUrl}/api/my-stores/`);
            setStores(response.results); // Assuming results is the array of stores in your response
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    if (loading) {
        return (
            <Center height="100vh">
                <Spinner size="xl" />
            </Center>
        );
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                {error}
            </Alert>
        );
    }

    const handleStoreClick = (id) => {
        navigate(`/store/${id}`);
    };

    const handleCreateStore = () => {
        navigate("/create-store");
    };

    return (
        <Box p={5}>
            <Heading as="h1" mb={5} display="flex" justifyContent="space-between" alignItems="center">
                Stores
                <Button colorScheme="teal" onClick={handleCreateStore}>
                    Create Store
                </Button>
            </Heading>
            {stores.length > 0 ? (
                <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} spacing={5}>
                    {stores.map((store) => (
                        <Box 
                            key={store.id} 
                            p={5} 
                            shadow="md" 
                            borderWidth="1px" 
                            borderRadius="md" 
                            onClick={() => handleStoreClick(store.id)}
                            _hover={{ cursor: "pointer", bg: "gray.100" }}
                        >
                            <Heading fontSize="xl">{store.name}</Heading>
                        </Box>
                    ))}
                </SimpleGrid>
            ) : (
                <Alert status="info">
                    <AlertIcon />
                    No stores found.
                </Alert>
            )}
        </Box>
    );
};

export default ListStoreScreen;
