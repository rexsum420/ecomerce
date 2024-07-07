import React, { useState, useEffect } from "react";
import { Box, Spinner, Alert, AlertIcon, Heading, Text, Grid, GridItem, Image, Button } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../utils/Api";

const StoreScreen = () => {
    const { id } = useParams();
    const [store, setStore] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [unAuth, setUnAuth] = useState(false);
    const [prods, setProds] = useState([]);
    const navigate = useNavigate();

    const fetchStore = async (storeId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://192.168.1.75:8000/api/stores/${storeId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
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
    } 

    const fetchProducts = async() => {
        try {
            const res = await Api(`http://192.168.1.75:8000/api/products/?store=${id}`);
            setProds(res.results);
            console.log(res.results);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStore(id);
        fetchProducts();
    }, []);

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

    const handleAddProduct = () => {
        window.location.href = `http://localhost:3000/store/${id}/add-product`;
    };

    const handleEditStore = () => {
        window.location.href = `http://localhost:3000/store/${id}/edit`;
    }

    return (
        <Box p={5}>
            <Heading as="h1" mb={5}>Store Details</Heading>
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md" display='flex' flexDirection='row' justifyContent='space-between'>
                <Heading fontSize="xl">
                    {store.name}
                </Heading>
                <Button onClick={() => handleEditStore()} colorScheme="blue">Edit Store</Button>
            </Box>
    
            <Box display='flex' flexDirection='row' justifyContent='space-between' mt={4}>
                <Box>
                    <Heading size="md">Description:</Heading>
                    <Text>{store.description}</Text>
                </Box>
                <Button onClick={() => handleAddProduct()} colorScheme="green">Add Product</Button>
            </Box>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }} gap={6} marginTop={10}>
                {prods.map((product) => {
                    const mainPicture = product.pictures.find(picture => picture.main);
                    return (
                        <GridItem key={product.id}>
                            <Box shadow="md" borderWidth="1px" borderRadius="md" p={5}>
                                <Heading fontSize="xl" mb={2}>{product.name}</Heading>
                                {mainPicture && <Image src={mainPicture.image} alt={mainPicture.alt || product.name} />}
                                <Text mt={2}>{product.description}</Text>
                                <Text mt={2} color="green.500">${product.price}</Text>
                                <Button mt={2} colorScheme="teal" onClick={() => navigate(`/view-product/${product.id}`)}>View Product</Button>
                            </Box>
                        </GridItem>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default StoreScreen;