import React, { useContext } from 'react';
import { CartContext } from './CartProvider.js';
import { Button } from '@chakra-ui/react';

const AddToCartButton = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <Button 
            backgroundColor="blue.500" 
            color="white" 
            _hover={{ backgroundColor: 'blue.600' }}
            onClick={() => addToCart(product)}
        >
            Add to Cart
        </Button>
    );
};

export default AddToCartButton;
