import React, { useState, useEffect } from "react";
import { Box, Spinner, Alert, AlertIcon, Heading, Text, Grid, GridItem, Button, HStack } from "@chakra-ui/react";

const Purchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [currentPage, setCurrentPage] = useState(`${process.env.REACT_APP_API_BASE_URL}/api/orders/`);

    const fetchPurchases = async (url) => {
        try {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const res = await response.json();
            if (res.results.length > 0) {
                const customerPurchases = res.results.filter(order => order.customer.username === username);
                setPurchases(customerPurchases);
            } else {
                setPurchases([]);
            }
            setNextPage(res.next);
            setPreviousPage(res.previous);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching purchases:", error);
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPurchases(currentPage);
    }, [currentPage]);

    const handleNextPage = () => {
        if (nextPage) {
            setCurrentPage(nextPage);
        }
    };

    const handlePreviousPage = () => {
        if (previousPage) {
            setCurrentPage(previousPage);
        }
    };

    if (loading) {
        return <Spinner size="xl" />;
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                Error fetching purchases.
            </Alert>
        );
    }

    return (
        <Box p={5}>
            <Heading as="h1" mb={5}>Purchases</Heading>
            {purchases.length === 0 ? (
                <Text>No purchases found.</Text>
            ) : (
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }} gap={6}>
                    {purchases.map((purchase) => (
                        <GridItem key={purchase.transaction_id}>
                            <Box shadow="md" borderWidth="1px" borderRadius="md" p={5} height="100%">
                                <Heading fontSize="xl" mb={2}>Order ID: {purchase.transaction_id}</Heading>
                                <Text mt={2}>Store: {purchase.store.name}</Text>
                                <Text mt={2}>Total: ${purchase.total}</Text>
                                <Button mt={2} colorScheme="teal" onClick={() => console.log('View Purchase Details')}>View Details</Button>
                            </Box>
                        </GridItem>
                    ))}
                </Grid>
            )}
            <HStack mt={5} justifyContent="space-between">
                <Button onClick={handlePreviousPage} isDisabled={!previousPage}>Previous</Button>
                <Button onClick={handleNextPage} isDisabled={!nextPage}>Next</Button>
            </HStack>
        </Box>
    );
};

export default Purchases;

