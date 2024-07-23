import React from 'react';
import { Box, Text, Button, Flex } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Transaction from '../components/Transaction'; // Adjust the import path as needed

const Confirm = ({ selectedShippingAddress, cart, selectedCard, creditCards, billingAddress, onBack }) => {
    const navigate = useNavigate();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const handleFinalConfirmation = () => {
        // Handle final payment confirmation logic here
        navigate('/payment-success');
    };

    const cardDetails = creditCards.find(card => card.id === selectedCard);

    return (
        <Box p={5}>
            <Text fontWeight="bold" mb={4}>Confirm Payment</Text>
            <Transaction 
                shippingAddress={selectedShippingAddress}
                billingAddress={billingAddress}
                cardDetails={cardDetails}
                cart={cart}
            />
            <Flex justify="space-between" mt={4}>
                <Button colorScheme="red" onClick={onBack}>Back</Button>
                <Button colorScheme="blue" onClick={handleFinalConfirmation}>Confirm Payment</Button>
            </Flex>
        </Box>
    );
};

export default Confirm;
