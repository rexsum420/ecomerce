import React, { useContext } from 'react';
import { CartContext } from '../contexts/CartContext';

const AddToCartButton = ({ product }) => {
    const { addToCart } = useContext(CartContext);

    return (
        <button onClick={() => addToCart(product)}>
            Add to Cart
        </button>
    );
};

export default AddToCartButton;