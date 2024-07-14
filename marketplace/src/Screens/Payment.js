import React from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Text, Flex } from '@chakra-ui/react';

const Payment = () => {
    const location = useLocation();
    const { selectedShippingAddress, cart } = location.state;

    const calculateTotal = () => {
        return cart.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2);
    };

    const calculateTax = () => {
        return (calculateTotal() * 0.0825).toFixed(2);
    };

    return (
        <Box p={5}>
            <Text fontWeight="bold" mb={4}>Payment</Text>
            <Box mb={4}>
                <Text fontWeight="bold">Shipping Address</Text>
                <Text>{selectedShippingAddress.name}</Text>
                <Text>{selectedShippingAddress.address1}</Text>
                <Text>{selectedShippingAddress.address2}</Text>
                <Text>{selectedShippingAddress.city}, {selectedShippingAddress.state} {selectedShippingAddress.zip}</Text>
            </Box>
            <Box mb={4}>
                <Text fontWeight="bold">Order Summary</Text>
                {cart.map(product => (
                    <Flex key={product.id} p={4} borderWidth={1} borderRadius="md" mb={2} alignItems="center" shadow="md">
                        <Text flex="1">{product.name}</Text>
                        <Text>${product.price} each</Text>
                        <Text mx={2}>Quantity: {product.quantity}</Text>
                        <Text>Line Total: ${(product.price * product.quantity).toFixed(2)}</Text>
                    </Flex>
                ))}
                <Text fontWeight="bold" mt={4}>Tax: ${calculateTax()}</Text>
                <Text fontWeight="bold">Total: ${(parseFloat(calculateTotal()) + parseFloat(calculateTax())).toFixed(2)}</Text>
            </Box>
        </Box>
    );
};

export default Payment