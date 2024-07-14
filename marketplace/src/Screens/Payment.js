import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Text, Flex, Button, Input, FormControl, FormLabel, useColorModeValue } from '@chakra-ui/react';
import Confirm from './Confirm';
import AddCreditCardModal from '../components/AddCreditCardModal';

const BillingAddressInput = ({ address, setAddress }) => (
    <Box>
        <Text fontWeight="bold">Billing Address</Text>
        <FormControl id="billing_name" isRequired mt={2}>
            <FormLabel>Name</FormLabel>
            <Input type="text" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} />
        </FormControl>
        <FormControl id="billing_address1" isRequired mt={2}>
            <FormLabel>Address Line 1</FormLabel>
            <Input type="text" value={address.address1} onChange={(e) => setAddress({ ...address, address1: e.target.value })} />
        </FormControl>
        <FormControl id="billing_address2" mt={2}>
            <FormLabel>Address Line 2</FormLabel>
            <Input type="text" value={address.address2} onChange={(e) => setAddress({ ...address, address2: e.target.value })} />
        </FormControl>
        <FormControl id="billing_city" isRequired mt={2}>
            <FormLabel>City</FormLabel>
            <Input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
        </FormControl>
        <FormControl id="billing_state" isRequired mt={2}>
            <FormLabel>State</FormLabel>
            <Input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
        </FormControl>
        <FormControl id="billing_zip" isRequired mt={2}>
            <FormLabel>ZIP Code</FormLabel>
            <Input type="text" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} />
        </FormControl>
    </Box>
);

const Payment = () => {
    const location = useLocation();
    const { selectedShippingAddress, cart } = location.state;

    const [creditCards, setCreditCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [billingAddress, setBillingAddress] = useState({
        name: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
    });

    const newCardFormBg = useColorModeValue('#C0C0C0', 'gray.700');
    const selectedCardTextColor = useColorModeValue('black', 'black');
    const unselectedCardTextColor = useColorModeValue('black', 'white');

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
                setCreditCards(data.results);
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

    const handleAddCard = async (newCardData) => {
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
                return Promise.resolve();
            } else {
                const errorData = await response.json();
                return Promise.reject(errorData);
            }
        } catch (error) {
            console.error('Error adding new credit card:', error);
            return Promise.reject({ general: 'Error adding new credit card' });
        }
    };

    const handleConfirmPayment = () => {
        setShowConfirm(true);
    };

    return (
        <Box p={5}>
            {showConfirm ? (
                <Confirm
                    selectedShippingAddress={selectedShippingAddress}
                    cart={cart}
                    selectedCard={selectedCard}
                    creditCards={creditCards}
                    billingAddress={billingAddress} // Pass billingAddress here
                    onBack={() => setShowConfirm(false)}
                />
            ) : (
                <>
                    <Text fontWeight="bold" mb={4}>Payment</Text>
                    <Box textAlign={'left'} shadow="md" borderWidth={1} borderRadius="md" mb={4}>
                        <Text textAlign='center' fontWeight="bold">Shipping Address</Text>
                        <Text>{selectedShippingAddress.name}</Text>
                        <Text>{selectedShippingAddress.address1}</Text>
                        <Text>{selectedShippingAddress.address2}</Text>
                        <Text>{selectedShippingAddress.city}, {selectedShippingAddress.state} {selectedShippingAddress.zip}</Text>
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
                                        bg={selectedCard === card.id ? 'blue.100' : 'transparent'}
                                        textAlign="left"
                                        color={selectedCard === card.id ? selectedCardTextColor : unselectedCardTextColor}
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
                        <Button colorScheme="green" mt={4} onClick={() => setIsModalOpen(true)}>
                            Add New Credit Card
                        </Button>
                    </Box>
                    {selectedCard && (
                        <>
                            <BillingAddressInput address={billingAddress} setAddress={setBillingAddress} />
                            <Box mt={4} textAlign="right">
                                <Button colorScheme="blue" mt={4} onClick={handleConfirmPayment}>
                                    Confirm Payment
                                </Button>
                            </Box>
                        </>
                    )}
                </>
            )}
            <AddCreditCardModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddCard}
            />
        </Box>
    );
};

export default Payment;