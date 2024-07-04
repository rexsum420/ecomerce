import React, { useState, useEffect } from "react";
import { Box, Spinner, Alert, AlertIcon, Heading, Text, Grid, GridItem, Image } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import Api from "../utils/Api";

const StoreScreen = () => {
    const { id } = useParams();
    const [store, setStore] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [unAuth, setUnAuth] = useState(false);
    const [prods, setProds] = useState([]);

    const fetchStore = async (storeId) => {
        try {
            const res = await Api(`http://192.168.1.75:8000/api/stores/${storeId}/`);
            if (res.status_code !== 401) {
                setStore(res); // Assuming res contains the store data
                setLoading(false);
            } else {
                console.log("Unauthorized");
                setUnAuth(true);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching store:", error);
            setError(true);
            setLoading(false);
        }
    };

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
    }, [id]);

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
        <Box p={5}>
            <Heading as="h1" mb={5}>Store Details</Heading>
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                <Heading fontSize="xl">{store.name}</Heading>
                <Box mt={4}>
                    <Heading size="md">Description:</Heading>
                    <Text>{store.description}</Text>
                </Box>
            </Box>
            <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6} marginTop={10}>
                {prods.map((product) => {
                    const mainPicture = product.pictures.find(picture => picture.main);
                    return (
                        <GridItem key={product.id}>
                            <Box shadow="md" borderWidth="1px" borderRadius="md" p={5}>
                                <Heading fontSize="xl" mb={2}>{product.name}</Heading>
                                {mainPicture && <Image src={mainPicture.image} alt={mainPicture.alt || product.name} />}
                                <Text mt={2}>{product.description}</Text>
                                <Text mt={2} color="green.500">${product.price}</Text>
                            </Box>
                        </GridItem>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default StoreScreen;