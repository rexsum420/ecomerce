import React, { useContext } from 'react';
import { CartContext } from '../components/CartProvider';
import { Box, Button, Flex, Image, Input, Text } from '@chakra-ui/react';

const ViewCart = () => {
    const { cart, setCart, removeFromCart, clearCart } = useContext(CartContext);

    const handleQuantityChange = (product, quantity) => {
        const newCart = cart.map(item => 
            item.id === product.id ? { ...item, quantity: parseInt(quantity) } : item
        );
        setCart(newCart);
    };

    return (
        <Box p={5}>
            {cart.length === 0 ? (
                <Text>Your cart is empty</Text>
            ) : (
                cart.map(product => (
                    <Flex key={product.id} p={4} borderWidth={1} borderRadius="md" mb={2} alignItems="center">
                        <Image src={product.image} alt={product.name} boxSize="100px" objectFit="cover" mr={4} />
                        <Box flex="1">
                            <Text fontWeight="bold">{product.name}</Text>
                            <Text>${product.price}</Text>
                            <Input
                                type="number"
                                value={product.quantity}
                                min="1"
                                onChange={(e) => handleQuantityChange(product, e.target.value)}
                                width="60px"
                            />
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
