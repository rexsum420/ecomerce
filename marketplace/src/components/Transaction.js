import React from 'react';
import { Box, Text, Flex } from '@chakra-ui/react';

const Transaction = ({ shippingAddress, billingAddress, cardDetails, cart }) => {
    const groupByStore = (cartItems) => {
        return cartItems.reduce((acc, item) => {
            if (!acc[item.store]) {
                acc[item.store] = [];
            }
            acc[item.store].push(item);
            return acc;
        }, {});
    };

    const storeGroupedProducts = groupByStore(cart);

    return (
        <Box>
            <Box mb={4}>
                <Text textAlign='center' fontWeight="bold">Shipping Address</Text>
                <Box p={4} mb={4}>
                    <Text>{shippingAddress.name}</Text>
                    <Text>{shippingAddress.address1}</Text>
                    <Text>{shippingAddress.address2}</Text>
                    <Text>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}</Text>
                </Box>
                <Text textAlign='center' fontWeight="bold">Credit Card</Text>
                <Box mb={4}>
                    <Box p={4} textAlign="left">
                        <Text>{cardDetails.cardholder_name}</Text>
                        <Text>**** **** **** {cardDetails.card_number.slice(-4)}</Text>
                        <Text>Expires: {cardDetails.expiration_date}</Text>
                    </Box>
                    {!(
                        shippingAddress.name === billingAddress.name &&
                        shippingAddress.address1 === billingAddress.address1 &&
                        shippingAddress.address2 === billingAddress.address2 &&
                        shippingAddress.city === billingAddress.city &&
                        shippingAddress.state === billingAddress.state &&
                        shippingAddress.zip === billingAddress.zip
                    ) && (
                        <Box mt={4} p={4} textAlign="left">
                            <Text>{billingAddress.address1}</Text>
                            {billingAddress.address2 && <Text>{billingAddress.address2}</Text>}
                            <Text>{billingAddress.city}, {billingAddress.state} {billingAddress.zip}</Text>
                        </Box>
                    )}
                </Box>
            </Box>
            <Box mb={4}>
                <Text fontWeight="bold">Order Summary</Text>
                {Object.keys(storeGroupedProducts).map(store => (
                    <Box key={store} mb={4}>
                        <Text fontWeight="bold">{store}</Text>
                        {storeGroupedProducts[store].map(product => (
                            <Flex key={product.id} p={4} borderWidth={1} borderRadius="md" mb={2} alignItems="center" shadow="md">
                                <Text mx={2}>{product.quantity}</Text>
                                <Text flex="1">{product.name}</Text>
                                <Text>${(product.price * product.quantity).toFixed(2)}</Text>
                            </Flex>
                        ))}
                    </Box>
                ))}
                <Text textAlign={'right'} fontWeight="bold" mt={4}>Tax: ${(cart.reduce((total, product) => total + (product.price * product.quantity), 0) * 0.0825).toFixed(2)}</Text>
                <Text textAlign={'right'} fontWeight="bold">Total: ${(parseFloat(cart.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2)) + parseFloat((cart.reduce((total, product) => total + (product.price * product.quantity), 0) * 0.0825).toFixed(2))).toFixed(2)}</Text>
            </Box>
        </Box>
    );
};

export default Transaction;
