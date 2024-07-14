import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '../components/CartProvider';
import { Box, Button, Flex, Image, Text, Spinner, IconButton, useToast, useColorModeValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { AddIcon } from '@chakra-ui/icons';

const Checkout = () => {
    const { cart } = useContext(CartContext);
    const [shippingAddresses, setShippingAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const fetchShippingAddresses = async () => {
            const username = localStorage.getItem('username');
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`http://192.168.1.75:8000/api/shipping/${username}/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                setShippingAddresses(data); // Adjust based on actual response structure
                setLoading(false);
            } catch (error) {
                console.error('Error fetching shipping addresses:', error);
                setLoading(false);
            }
        };

        fetchShippingAddresses();
    }, []);

    const getMainImage = (pictures) => {
        const mainImage = pictures.find(picture => picture.main);
        return mainImage ? mainImage.image : '';
    };

    const calculateTotal = () => {
        return cart.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2);
    };

    const calculateTax = () => {
        return (calculateTotal() * 0.0825).toFixed(2);
    };

    const handleAddressSelect = (addressId) => {
        setSelectedAddress(addressId);
    };

    const handleProceedToPayment = () => {
        if (!selectedAddress) {
            toast({
                title: "No address selected",
                description: "Please select a shipping address before proceeding to payment.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }
        const selectedShippingAddress = shippingAddresses.find(address => address.id === selectedAddress);
        navigate('/payment', { state: { selectedShippingAddress, cart } });
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <Box p={5}>
            {cart && cart.length === 0 ? (
                <Text>Your cart is empty</Text>
            ) : (
                cart.map(product => (
                    <Flex key={product.id} p={4} borderWidth={1} borderRadius="md" mb={2} alignItems="center" shadow="md">
                        <Image src={getMainImage(product.pictures)} alt={product.name} boxSize="90px" objectFit="cover" mr={4} borderRadius="md" />
                        <Box flex="1">
                            <Text fontWeight="bold">{product.name}</Text>
                            <Text>${product.price} each</Text>
                            <Flex alignItems="center" mt={2}>
                                <Text mx={2}>{product.quantity}</Text>
                            </Flex>
                        </Box>
                        <Box textAlign="right">
                            <Text>Line Total: ${(product.price * product.quantity).toFixed(2)}</Text>
                        </Box>
                    </Flex>
                ))
            )}
            {cart && cart.length > 0 && (
                <Box mt={4}>
                    <Flex justify="space-between" align="center" mb={4}>
                        <Text fontWeight="bold">Select Shipping Address</Text>
                        <IconButton
                            icon={<AddIcon />}
                            size="sm"
                            onClick={() => navigate('/add-shipping')}
                            aria-label="Add new shipping address"
                        />
                    </Flex>
                    {shippingAddresses && shippingAddresses.length > 0 ? (
                        <Flex direction="column" gap={4}>
                            {shippingAddresses.map(address => (
                                <Box
                                    key={address.id}
                                    p={4}
                                    borderWidth={1}
                                    borderRadius="md"
                                    shadow="md"
                                    cursor="pointer"
                                    onClick={() => handleAddressSelect(address.id)}
                                    bg={selectedAddress === address.id ? 'blue.100' : 'transparent'}
                                    textAlign="left"
                                >
                                    <Text color={selectedAddress === address.id ? 'black' : 'inherit'}>{address.name}</Text>
                                    <Text color={selectedAddress === address.id ? 'black' : 'inherit'}>{address.address1}</Text>
                                    <Text color={selectedAddress === address.id ? 'black' : 'inherit'}>{address.address2}</Text>
                                    <Text color={selectedAddress === address.id ? 'black' : 'inherit'}>{address.city}, {address.state} {address.zip}</Text>
                                </Box>
                            ))}
                        </Flex>
                    ) : (
                        <Text>No shipping addresses available.</Text>
                    )}
                </Box>
            )}
            {cart && cart.length > 0 && selectedAddress && (
                <Box mt={4} textAlign="right">
                    <Text fontWeight="bold">Tax: ${calculateTax()}</Text>
                    <Text fontWeight="bold">Total: ${(parseFloat(calculateTotal()) + parseFloat(calculateTax())).toFixed(2)}</Text>
                    <Button colorScheme="blue" mt={4} onClick={handleProceedToPayment}>
                        Proceed to Payment
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Checkout;
