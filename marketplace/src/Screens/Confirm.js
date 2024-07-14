import React from 'react';
import { Box, Text, Button, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Confirm = ({ selectedShippingAddress, cart, selectedCard, creditCards, billingAddress, onBack }) => {
    const navigate = useNavigate();

    const handleFinalConfirmation = () => {
        // Handle final payment confirmation logic here
        navigate('/payment-success');
    };

    const cardDetails = creditCards.find(card => card.id === selectedCard);

    const billingSameAsShipping = () => {
        return (
            selectedShippingAddress.name === billingAddress.name &&
            selectedShippingAddress.address1 === billingAddress.address1 &&
            selectedShippingAddress.address2 === billingAddress.address2 &&
            selectedShippingAddress.city === billingAddress.city &&
            selectedShippingAddress.state === billingAddress.state &&
            selectedShippingAddress.zip === billingAddress.zip
        );
    };

    return (
        <Box p={5}>
            <Text fontWeight="bold" mb={4}>Confirm Payment</Text>
            <Box textAlign={'left'} shadow="md" borderWidth={1} borderRadius="md" mb={4}>
                <Text textAlign='center' fontWeight="bold">Shipping Address</Text>
                <Box mb={4}>
                    <Text>{selectedShippingAddress.name}</Text>
                    <Text>{selectedShippingAddress.address1}</Text>
                    <Text>{selectedShippingAddress.address2}</Text>
                    <Text>{selectedShippingAddress.city}, {selectedShippingAddress.state} {selectedShippingAddress.zip}</Text>
                </Box>
                <Text textAlign='center' fontWeight="bold">Credit Card</Text>
                <Box mb={4}>
                    <Box p={4} borderWidth={1} borderRadius="md" shadow="md" textAlign="left">
                        <Text>{cardDetails.cardholder_name}</Text>
                        <Text>**** **** **** {cardDetails.card_number.slice(-4)}</Text>
                        <Text>Expires: {cardDetails.expiration_date}</Text>
                    </Box>
                    {/* Include billing address in the same box */}
                    {!billingSameAsShipping() && (
                        <Box mt={4} p={4} borderWidth={1} borderRadius="md" shadow="md" textAlign="left">
                            <Text fontWeight="bold">Billing Address</Text>
                            <Text>{billingAddress.name}</Text>
                            <Text>{billingAddress.address1}</Text>
                            {billingAddress.address2 && <Text>{billingAddress.address2}</Text>}
                            <Text>{billingAddress.city}, {billingAddress.state} {billingAddress.zip}</Text>
                        </Box>
                    )}
                </Box>
            </Box>
            <Box mb={4}>
                <Text fontWeight="bold">Order Summary</Text>
                {cart.map(product => (
                    <Flex key={product.id} p={4} borderWidth={1} borderRadius="md" mb={2} alignItems="center" shadow="md">
                        <Text mx={2}>{product.quantity}</Text>
                        <Text flex="1">{product.name}</Text>
                        <Text>${(product.price * product.quantity).toFixed(2)}</Text>
                    </Flex>
                ))}
                <Text textAlign={'right'} fontWeight="bold" mt={4}>Tax: ${(cart.reduce((total, product) => total + (product.price * product.quantity), 0) * 0.0825).toFixed(2)}</Text>
                <Text textAlign={'right'} fontWeight="bold">Total: ${(parseFloat(cart.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2)) + parseFloat((cart.reduce((total, product) => total + (product.price * product.quantity), 0) * 0.0825).toFixed(2))).toFixed(2)}</Text>
            </Box>
            <Flex justify="space-between" mt={4}>
                <Button colorScheme="red" onClick={onBack}>Back</Button>
                <Button colorScheme="blue" onClick={handleFinalConfirmation}>Confirm Payment</Button>
            </Flex>
        </Box>
    );
};

export default Confirm;
