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

    const fetchStore = async (storeName) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://192.168.1.75:8000/get-store/name/${storeName}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token && { 'Authorization': `Token ${token}` })
                }
            });

            if (response.status === 401) {
                console.log("Unauthorized");
                setUnAuth(true);
                setLoading(false);
            } else if (response.ok) {
                const data = await response.json();
                setStore(data);
                setLoading(false);
            } else {
                console.error("Error fetching store:", response.statusText);
                setError(true);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching store:", error);
            setError(true);
            setLoading(false);
        }
    };

    const fetchProducts = async (storeName) => {
        try {
            const res = await fetch(`http://192.168.1.75:8000/api/products/?store=${storeName}`);
            const data = await res.json();
            setProds(data.results);
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
        return <Spinner size="xl" />;
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
        <Box p={5} w={{ base: '100%', md: '40%' }} mx="auto">
            <Heading as="h1" mb={5}>Store Details</Heading>
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                <Heading fontSize="xl" mb={2}>{store.name}</Heading>
                <Text>{store.description}</Text>
                <Text>{store.website}</Text>
                <Text>{store.phone}</Text>
            </Box>

            <Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap={6} mt={10}>
                {prods.map((product) => {
                    const mainPicture = product.pictures.find(picture => picture.main);
                    return (
                        <GridItem key={product.id}>
                            <Box shadow="md" borderWidth="1px" borderRadius="md" p={5}>
                                <Heading fontSize="xl" mb={2}>{product.name}</Heading>
                                {mainPicture && <Image src={mainPicture.image} alt={mainPicture.alt || product.name} />}
                                <Text mt={2}>{product.description}</Text>
                                <Text mt={2} color="green.500">${product.price}</Text>
                                <Button onClick={() => navigate(`/view-product/${product.id}`)}>View Product</Button>
                            </Box>
                        </GridItem>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default PublicViewStore;