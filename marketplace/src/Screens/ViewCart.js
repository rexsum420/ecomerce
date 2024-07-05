import React, { useContext } from 'react';
import { CartContext } from '../components/CartProvider';
import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';

const ViewCart = () => {
    const { cart, setCart, removeFromCart, clearCart } = useContext(CartContext);

    const handleQuantityChange = (product, change) => {
        const newCart = cart.map(item => 
            item.id === product.id ? { ...item, quantity: item.quantity + change } : item
        ).filter(item => item.quantity > 0);
        setCart(newCart);
    };

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

    return (
        <Box p={5}>
            {cart.length === 0 ? (
                <Text>Your cart is empty</Text>
            ) : (
                cart.map(product => (
                    <Flex key={product.id} p={4} borderWidth={1} borderRadius="md" mb={2} alignItems="center">
                        <Image src={getMainImage(product.pictures)} alt={product.name} boxSize="90px" objectFit="cover" mr={4} />
                        <Box flex="1">
                            <Text fontWeight="bold">{product.name}</Text>
                            <Text>${product.price} each</Text>
                            <Flex alignItems="center">
                                <Button onClick={() => handleQuantityChange(product, -1)}>-</Button>
                                <Text mx={2}>{product.quantity}</Text>
                                <Button onClick={() => handleQuantityChange(product, 1)}>+</Button>
                            </Flex>
                            
                        </Box>
                        <Box>
                        <Text textAlign='right'>Line Total: ${(product.price * product.quantity).toFixed(2)}</Text>
                        <Button ml={4} colorScheme="red" onClick={() => removeFromCart(product.id)}>Remove</Button>
                        </Box>
                    </Flex>
                ))
            )}
            {cart.length > 0 && (
                <Box mt={4}>
                    <Text textAlign='right' fontWeight='bold'>Tax: ${calculateTax()}</Text>
                    <Text textAlign='right' fontWeight="bold">Total: ${(parseFloat(calculateTotal()) + parseFloat(calculateTax())).toFixed(2)}</Text>
                    <Button mt={4} colorScheme="blue" onClick={clearCart}>Clear Cart</Button>
                </Box>
            )}
        </Box>
    );
};

export default ViewCart;
