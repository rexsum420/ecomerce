import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, FormHelperText, Button } from '@chakra-ui/react';

const AddCreditCardModal = ({ isOpen, onClose, onSubmit }) => {
    const [newCardData, setNewCardData] = useState({
        card_number: '',
        expiration_date: '',
        cvv: '',
        cardholder_name: '',
    });

    const [formErrors, setFormErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCardData({
            ...newCardData,
            [name]: value
        });
    };

    const handleSubmit = () => {
        onSubmit(newCardData)
            .then(() => {
                setNewCardData({
                    card_number: '',
                    expiration_date: '',
                    cvv: '',
                    cardholder_name: '',
                });
                setFormErrors({});
                onClose();
            })
            .catch((errors) => setFormErrors(errors));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add New Credit Card</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
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
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Add Card
                    </Button>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddCreditCardModal;