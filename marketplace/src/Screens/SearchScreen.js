import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Spinner, Alert, AlertIcon, Heading, Text, Grid, GridItem, Image } from "@chakra-ui/react";
import Api from "../utils/Api";
import ProductCard from "../components/ProductCard";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const SearchScreen = () => {
    const query = useQuery();
    const term = query.get('term');
    const [prods, setProds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchProducts = async() => {
        try {
            const res = await Api(`http://192.168.1.75:8000/api/products/?search=${term}`);
            setProds(res.results);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [term]);

    if (loading) {
        return <Spinner size="xl" />;
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                Error fetching products.
            </Alert>
        );
    }

    return (
        <Box p={5}>
            <Heading as="h1" mb={5}>Search Results for "{term}"</Heading>
            <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
                {prods.map((product) => (
                    <GridItem key={product.id}>
                        <ProductCard product={product} />
                    </GridItem>
                ))}
            </Grid>
        </Box>
    );
};

export default SearchScreen;
