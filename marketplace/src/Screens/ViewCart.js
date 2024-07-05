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
                            <Text>${product.price}</Text>
                            <Flex alignItems="center">
                                <Button onClick={() => handleQuantityChange(product, -1)}>-</Button>
                                <Text mx={2}>{product.quantity}</Text>
                                <Button onClick={() => handleQuantityChange(product, 1)}>+</Button>
                            </Flex>
                        </Box>
                        <Button ml={4} colorScheme="red" onClick={() => removeFromCart(product.id)}>Remove</Button>
                    </Flex>
                ))
            )}
            {cart.length > 0 && (
                <Button mt={4} colorScheme="blue" onClick={clearCart}>Clear Cart</Button>
            )}
        </Box>
    );
};

export default ViewCart;
