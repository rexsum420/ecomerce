import React, { useState, useEffect } from "react";
import { Box, Spinner, Alert, AlertIcon, Heading, Text, Grid, GridItem, Image, Button } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

const PublicViewStore = () => {
    const { name } = useParams();
    const [store, setStore] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [unAuth, setUnAuth] = useState(false);
    const [prods, setProds] = useState([]);
    const navigate = useNavigate();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const fetchStore = async (storeName) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiBaseUrl}/api/get-store/?store=${storeName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Token ${token}` })
                }
            });
    
            if (!response.ok) {
                if (response.status === 404) {
                    console.error("Page Not Found", response.statusText);
                    setError(true);
                } else {
                    console.error("HTTP error:", response.status, response.statusText);
                    setError(true);
                }
                setLoading(false);
                return;
            }
    
            try {
                const data = await response.json();
                console.log(data);
                setStore(data[0]);
                setError(false);
            } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError);
                setError(true);
            }
    
            setLoading(false);
        } catch (fetchError) {
            console.error("Error fetching store:", fetchError);
            setError(true);
            setLoading(false);
        }
    };
    

    const fetchProducts = async (storeName) => {
        try {
            const res = await fetch(`${apiBaseUrl}/api/homepage/?store=${storeName}`);
            const data = await res.json();
            setProds(data.results);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStore(name);
        fetchProducts(name);
    }, [name]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                Error fetching store.
            </Alert>
        );
    }

    if (unAuth) {
        return (
            <Alert status="error">
                <AlertIcon />
                Unauthorized access.
            </Alert>
        );
    }

    return (
        <Box p={5} w={{ base: '100%', md: '60%' }} mx="auto">
            <Heading as="h1" mb={5}>Store Details</Heading>
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                <Heading fontSize="xl" mb={2}>{store.name}</Heading>
                <Text>{store.description}</Text>
                <Text>{store.website}</Text>
                <Text>{store.phone}</Text>
            </Box>

            <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6} mt={10}>
                {prods.map((product) => (
                    <GridItem key={product.id}>
                        <Box shadow="md" borderWidth="1px" borderRadius="md" p={5}>
                            <Heading fontSize="xl" mb={2}>{product.name}</Heading>
                            {product.pictures && <Image src={product.pictures} alt={product.name || product.name} />}
                            <Text mt={2}>{product.description}</Text>
                            <Text mt={2} color="green.500">${product.price}</Text>
                            <Button mt={2} colorScheme="teal" onClick={() => navigate(`/view-product/${product.id}`)}>View Product</Button>
                        </Box>
                    </GridItem>
                ))}
            </Grid>
        </Box>
    );
};

export default PublicViewStore;
