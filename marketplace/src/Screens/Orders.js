import React, { useState, useEffect } from "react";
import { Box, Spinner, Alert, AlertIcon, Heading, Text, Grid, GridItem, Button, HStack } from "@chakra-ui/react";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [nextPage, setNextPage] = useState(null);
    const [previousPage, setPreviousPage] = useState(null);
    const [currentPage, setCurrentPage] = useState(`${process.env.REACT_APP_API_BASE_URL}/api/orders/`);

    const fetchOrders = async (url) => {
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
                const ownerOrders = res.results.filter(order => order.store.owner.username === username);
                setOrders(ownerOrders);
            } else {
                setOrders([]);
            }
            setNextPage(res.next);
            setPreviousPage(res.previous);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage);
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
                Error fetching orders.
            </Alert>
        );
    }

    return (
        <Box p={5}>
            <Heading as="h1" mb={5}>Orders</Heading>
            {orders.length === 0 ? (
                <Text>No orders found.</Text>
            ) : (
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }} gap={6}>
                    {orders.map((order) => (
                        <GridItem key={order.transaction_id}>
                            <Box shadow="md" borderWidth="1px" borderRadius="md" p={5} height="100%">
                                <Heading fontSize="xl" mb={2}>Order ID: {order.transaction_id}</Heading>
                                <Text mt={2}>Customer: {order.customer.first_name} {order.customer.last_name}</Text>
                                <Text mt={2}>Total: ${order.total}</Text>
                                <Button mt={2} colorScheme="teal" onClick={() => console.log('View Order Details')}>View Details</Button>
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

export default Orders;
