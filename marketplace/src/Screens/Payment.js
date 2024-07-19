import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Text, Flex, Button, Input, FormControl, FormLabel, useColorModeValue, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import Confirm from './Confirm';
import AddCreditCardModal from '../components/AddCreditCardModal';

const BillingAddressModal = ({ isOpen, onClose, billingAddress, setBillingAddress, onSave }) => (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Billing Address</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl id="billing_name" isRequired mt={2}>
                    <FormLabel>Name</FormLabel>
                    <Input type="text" value={billingAddress.name} onChange={(e) => setBillingAddress({ ...billingAddress, name: e.target.value })} />
                </FormControl>
                <FormControl id="billing_address1" isRequired mt={2}>
                    <FormLabel>Address Line 1</FormLabel>
                    <Input type="text" value={billingAddress.address1} onChange={(e) => setBillingAddress({ ...billingAddress, address1: e.target.value })} />
                </FormControl>
                <FormControl id="billing_address2" mt={2}>
                    <FormLabel>Address Line 2</FormLabel>
                    <Input type="text" value={billingAddress.address2} onChange={(e) => setBillingAddress({ ...billingAddress, address2: e.target.value })} />
                </FormControl>
                <FormControl id="billing_city" isRequired mt={2}>
                    <FormLabel>City</FormLabel>
                    <Input type="text" value={billingAddress.city} onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })} />
                </FormControl>
                <FormControl id="billing_state" isRequired mt={2}>
                    <FormLabel>State</FormLabel>
                    <Input type="text" value={billingAddress.state} onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })} />
                </FormControl>
                <FormControl id="billing_zip_code" isRequired mt={2}>
                    <FormLabel>ZIP Code</FormLabel>
                    <Input type="text" value={billingAddress.zip_code} onChange={(e) => setBillingAddress({ ...billingAddress, zip_code: e.target.value })} />
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onSave}>
                    Save
                </Button>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
);

const Payment = () => {
    const location = useLocation();
    const { selectedShippingAddress, cart } = location.state;

    const [creditCards, setCreditCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [billingAddresses, setBillingAddresses] = useState([]);
    const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
    const [billingAddress, setBillingAddress] = useState({
        name: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip_code: '',
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

    const handleCardSelect = async (cardId, cardNumber) => {
        setSelectedCard(cardId);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://192.168.1.75:8000/api/billing/?card=${cardNumber}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            setBillingAddresses(data.results);
        } catch (error) {
            console.error('Error fetching billing addresses:', error);
        }
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

    const handleSaveBillingAddress = async () => {
        const token = localStorage.getItem('token');
        const newBillingAddress = {
            ...billingAddress,
            card_number: creditCards.find(card => card.id === selectedCard).card_number
        };
        try {
            const response = await fetch('http://192.168.1.75:8000/api/billing/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBillingAddress)
            });

            if (response.status === 201) {
                const savedAddress = await response.json();
                setBillingAddresses([...billingAddresses, savedAddress]);
                setIsModalOpen(false);
            } else {
                const errorData = await response.json();
                console.error('Error saving billing address:', errorData);
            }
        } catch (error) {
            console.error('Error saving billing address:', error);
        }
    };

    const handleBillingAddressSelect = (address) => {
        setSelectedBillingAddress(address);
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
                    billingAddress={selectedBillingAddress}
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
                        <Text textAlign={'right'}>Total: ${calculateTotal()}</Text>
                        <Text textAlign={'right'}>Tax: ${calculateTax()}</Text>
                        <Text textAlign={'right'} fontWeight="bold">Grand Total: ${(parseFloat(calculateTotal()) + parseFloat(calculateTax())).toFixed(2)}</Text>
                    </Box>
                    <Text fontWeight="bold" mb={2}>Payment Methods</Text>
                    <Box bg={newCardFormBg} p={4} borderRadius="md" shadow="md" textAlign="center">
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
                                        onClick={() => handleCardSelect(card.id, card.card_number)}
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
                            <Text fontWeight="bold" mb={2}>Billing Addresses</Text>
                            {billingAddresses.length > 0 ? (
                                <Flex direction="column" gap={4}>
                                    {billingAddresses.map(address => (
                                        <Box
                                            key={address.id}
                                            p={4}
                                            borderWidth={1}
                                            borderRadius="md"
                                            shadow="md"
                                            textAlign="left"
                                            cursor="pointer"
                                            onClick={() => handleBillingAddressSelect(address)}
                                            bg={selectedBillingAddress?.id === address.id ? 'blue.100' : 'transparent'}
                                            color={selectedBillingAddress?.id === address.id ? selectedCardTextColor : unselectedCardTextColor}
                                        >
                                            <Text>{address.name}</Text>
                                            <Text>{address.address1}</Text>
                                            <Text>{address.address2}</Text>
                                            <Text>{address.city}, {address.state} {address.zip_code}</Text>
                                        </Box>
                                    ))}
                                </Flex>
                            ) : (
                                <Text>No billing addresses available.</Text>
                            )}
                            <Button colorScheme="blue" mt={4} onClick={() => setIsModalOpen(true)}>
                                Add New Billing Address
                            </Button>
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
            <BillingAddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                billingAddress={billingAddress}
                setBillingAddress={setBillingAddress}
                onSave={handleSaveBillingAddress}
            />
        </Box>
    );
};

export default Payment;