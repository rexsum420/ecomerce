import { useEffect, useState } from "react";
import { Box, SimpleGrid, Spinner, Alert, AlertIcon, Heading } from "@chakra-ui/react";
import Api from "../utils/Api";
import { useNavigate } from "react-router-dom";

const ListStoreScreen = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchStores = async () => {
        try {
            const response = await Api("http://192.168.1.75:8000/api/my-stores/");
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
        return <Spinner size="xl" />;
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

    return (
        <Box p={5}>
            <Heading as="h1" mb={5}>Stores</Heading>
            {stores.length > 0 ? (
                <SimpleGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} spacing={5}>
                    {stores.map(store => (
                        <Box key={store.id} p={5} shadow="md" borderWidth="1px" borderRadius="md" onClick={() => handleStoreClick(store.id)}>
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
