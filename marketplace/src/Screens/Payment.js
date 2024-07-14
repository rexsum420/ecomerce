import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Text, Flex, Button, Input, FormControl, FormLabel, FormHelperText } from '@chakra-ui/react';

const Payment = () => {
    const location = useLocation();
    const { selectedShippingAddress, cart } = location.state;

    const [creditCards, setCreditCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);

    // State for new credit card form fields
    const [newCardData, setNewCardData] = useState({
        card_number: '',
        expiration_date: '',
        cvv: '',
        cardholder_name: '',
    });

    // State for form validation errors
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        const fetchCreditCards = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://192.168.1.75:8000/api/credit-cards/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                setCreditCards(data);
            } catch (error) {
                console.error('Error fetching credit cards:', error);
            }
        };

        fetchCreditCards();
    }, []);

    const calculateTotal = () => {
        return cart.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2);
    };

    const calculateTax = () => {
        return (calculateTotal() * 0.0825).toFixed(2);
    };

    const handleCardSelect = (cardId) => {
        setSelectedCard(cardId);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCardData({
            ...newCardData,
            [name]: value
        });
    };

    const handleSubmitNewCard = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://192.168.1.75:8000/api/credit-cards/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newCardData)
            });

            if (response.status === 201) {
                const newCard = await response.json();
                setCreditCards([...creditCards, newCard]);
                setNewCardData({
                    card_number: '',
                    expiration_date: '',
                    cvv: '',
                    cardholder_name: '',
                });
                setFormErrors({});
            } else {
                const errorData = await response.json();
                setFormErrors(errorData);
            }
        } catch (error) {
            console.error('Error adding new credit card:', error);
        }
    };

    return (
        <Box p={5}>
            <Text fontWeight="bold" mb={4}>Payment</Text>
            <Box shadow="md" borderWidth={1} borderRadius="md" mb={4}>
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
                        <Text mx={2}>Quantity: {product.quantity}</Text>
                        <Text flex="1">{product.name}</Text>
                        <Text>${(product.price * product.quantity).toFixed(2)}</Text>
                    </Flex>
                ))}
                <Text textAlign={'right'} fontWeight="bold" mt={4}>Tax: ${calculateTax()}</Text>
                <Text textAlign={'right'} fontWeight="bold">Total: ${(parseFloat(calculateTotal()) + parseFloat(calculateTax())).toFixed(2)}</Text>
            </Box>
            <Box mb={4}>
                <Text fontWeight="bold">Select Credit Card</Text>
                {creditCards.length > 0 ? (
                    <Flex direction="column" gap={4}>
                        {creditCards.map(card => (
                            <Box
                                key={card.id}
                                p={4}
                                borderWidth={1}
                                borderRadius="md"
                                shadow="md"
                                cursor="pointer"
                                onClick={() => handleCardSelect(card.id)}
                                bg={selectedCard === card.id ? 'blue.100' : 'white'}
                                textAlign="left"
                            >
                                <Text>{card.cardholder_name}</Text>
                                <Text>**** **** **** {card.card_number.slice(-4)}</Text>
                                <Text>Expires: {card.expiration_date}</Text>
                            </Box>
                        ))}
                    </Flex>
                ) : (
                    <Text>No credit cards available.</Text>
                )}
            </Box>
            <Box mb={4}>
                <Text fontWeight="bold">Add New Credit Card</Text>
                <FormControl id="card_number" isRequired mt={2} isInvalid={formErrors.card_number}>
                    <FormLabel>Card Number</FormLabel>
                    <Input type="text" name="card_number" value={newCardData.card_number} onChange={handleInputChange} />
                    <FormHelperText>{formErrors.card_number}</FormHelperText>
                </FormControl>
                <FormControl id="expiration_date" isRequired mt={2} isInvalid={formErrors.expiration_date}>
                    <FormLabel>Expiration Date</FormLabel>
                    <Input type="text" name="expiration_date" value={newCardData.expiration_date} onChange={handleInputChange} />
                    <FormHelperText>{formErrors.expiration_date}</FormHelperText>
                </FormControl>
                <FormControl id="cvv" isRequired mt={2} isInvalid={formErrors.cvv}>
                    <FormLabel>CVV</FormLabel>
                    <Input type="text" name="cvv" value={newCardData.cvv} onChange={handleInputChange} />
                    <FormHelperText>{formErrors.cvv}</FormHelperText>
                </FormControl>
                <FormControl id="cardholder_name" isRequired mt={2} isInvalid={formErrors.cardholder_name}>
                    <FormLabel>Cardholder Name</FormLabel>
                    <Input type="text" name="cardholder_name" value={newCardData.cardholder_name} onChange={handleInputChange} />
                    <FormHelperText>{formErrors.cardholder_name}</FormHelperText>
                </FormControl>
                <Button colorScheme="blue" mt={4} onClick={handleSubmitNewCard}>
                    Add Card
                </Button>
            </Box>
            {selectedCard && (
                <Box mt={4} textAlign="right">
                    <Button colorScheme="blue" mt={4}>
                        Confirm Payment
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Payment;