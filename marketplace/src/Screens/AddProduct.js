import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, Image, VStack, useToast, Select, Grid, IconButton } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { CloseIcon } from '@chakra-ui/icons';

const AddProduct = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        store: parseInt(id, 10),
        name: '',
        description: '',
        price: '',
        size: '',
        color: '',
        variations: '',
        category: '',
        barcode_number: '',
        model_number: '',
        manufacturer: '',
        inventory_count: '',
    });
    const [productId, setProductId] = useState(null);
    const [pictures, setPictures] = useState([]);
    const [pictureURLs, setPictureURLs] = useState([]);
    const [mainIndex, setMainIndex] = useState(0);
    const toast = useToast();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const [existingPictures, setExistingPictures] = useState([]);

    useEffect(() => {
        if (productId) {
            fetchExistingPictures();
        }
    }, [productId]);

    const fetchExistingPictures = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/api/products/${productId}/pictures/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        });
        if (response.ok) {
            const data = await response.json();
            setExistingPictures(data);
        } else {
            toast({
                title: 'Error fetching existing pictures.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        const formDataToSend = Object.fromEntries(
            Object.entries(formData).filter(([_, value]) => value !== '')
        );

        formDataToSend.price = parseFloat(formDataToSend.price);
        formDataToSend.inventory_count = parseInt(formDataToSend.inventory_count, 10);

        const response = await fetch(`${apiBaseUrl}/api/products/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(formDataToSend)
        });
        const data = await response.json();
        if (response.ok) {
            setProductId(data.id);
            toast({
                title: 'Product created.',
                description: "Adding pictures now.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            handleUpload();
        } else {
            toast({
                title: 'Error creating product.',
                description: data.detail,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleFilesChangeAppend = (e) => {
        const newFiles = Array.from(e.target.files);
        const newURLs = newFiles.map(file => URL.createObjectURL(file));
        setPictures(prevPictures => [...prevPictures, ...newFiles]);
        setPictureURLs(prevURLs => [...prevURLs, ...newURLs]);
    };

    const handleUpload = async () => {
        const token = localStorage.getItem('token');
        for (let i = 0; i < pictures.length; i++) {
            const formData = new FormData();
            formData.append('product', parseInt(productId, 10));
            formData.append('image', pictures[i]);
            formData.append('alt', pictures[i].name);
            formData.append('main', i === mainIndex);

            const response = await fetch(`${apiBaseUrl}/api/pictures/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`
                },
                body: formData
            });

            if (response.ok) {
                toast({
                    title: `Picture ${i + 1} uploaded.`,
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: `Error uploading picture ${i + 1}.`,
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            }
        }

        // Delete removed pictures
        const existingIds = existingPictures.map(p => p.id);
        const currentIds = pictureURLs.map((_, index) => existingIds[index]);
        const deletedIds = existingIds.filter(id => !currentIds.includes(id));
        for (let id of deletedIds) {
            await deletePicture(id);
        }
    };

    const deletePicture = async (id) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${apiBaseUrl}/api/pictures/${id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`
            }
        });

        if (response.ok) {
            toast({
                title: 'Picture deleted.',
                status: 'success',
                duration: 2000,
                isClosable: true,
            });
        } else {
            toast({
                title: 'Error deleting picture.',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
        }
    };

    const handleRemovePicture = (index) => {
        const newPictures = pictures.filter((_, i) => i !== index);
        const newPictureURLs = pictureURLs.filter((_, i) => i !== index);
        setPictures(newPictures);
        setPictureURLs(newPictureURLs);
        if (mainIndex === index) {
            setMainIndex(newPictures.length > 0 ? 0 : -1);
        } else if (mainIndex > index) {
            setMainIndex(mainIndex - 1);
        }
    };

    return (
        <center>
            <Box p={5} width={{ base: '100%', md: '60%' }} mt="20px">
                <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                        <FormControl isRequired>
                            <FormLabel>Name</FormLabel>
                            <Input name="name" value={formData.name} onChange={handleChange} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea name="description" value={formData.description} onChange={handleChange} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Price</FormLabel>
                            <Input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Size</FormLabel>
                            <Select name="size" value={formData.size} onChange={handleChange}>
                                <option value="">Select size...</option>
                                <option value="XS">Extra Small</option>
                                <option value="S">Small</option>
                                <option value="M">Medium</option>
                                <option value="L">Large</option>
                                <option value="XL">Extra Large</option>
                                <option value="XXL">Double XL</option>
                                <option value="XXXL">Triple XL</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Color</FormLabel>
                            <Select name="color" value={formData.color} onChange={handleChange}>
                                <option value="">Select color...</option>
                                <option value="RED">Red</option>
                                <option value="BLU">Blue</option>
                                <option value="GRN">Green</option>
                                <option value="BLK">Black</option>
                                <option value="WHT">White</option>
                                <option value="YEL">Yellow</option>
                                <option value="ORN">Orange</option>
                                <option value="PUR">Purple</option>
                                <option value="PNK">Pink</option>
                                <option value="NVY">Navy</option>
                                <option value="GRY">Grey</option>
                                <option value="BRN">Brown</option>
                                <option value="TAN">Tan</option>
                                <option value="OTH">Other</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Variations</FormLabel>
                            <Textarea name="variations" value={formData.variations} onChange={handleChange} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Category</FormLabel>
                            <Select name="category" value={formData.category} onChange={handleChange}>
                                <option value="">Select category...</option>
                                <option value="electronics">Electronics</option>
                                <option value="clothing">Clothing</option>
                                <option value="home_kitchen">Home & Kitchen</option>
                                <option value="beauty_personal_care">Beauty & Personal Care</option>
                                <option value="health_wellness">Health & Wellness</option>
                                <option value="sports_outdoors">Sports & Outdoors</option>
                                <option value="toys_games">Toys & Games</option>
                                <option value="books">Books</option>
                                <option value="automotive">Automotive</option>
                                <option value="others">Others</option>
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Barcode Number</FormLabel>
                            <Input name="barcode_number" value={formData.barcode_number} onChange={handleChange} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Model Number</FormLabel>
                            <Input name="model_number" value={formData.model_number} onChange={handleChange} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Manufacturer</FormLabel>
                            <Input name="manufacturer" value={formData.manufacturer} onChange={handleChange} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Inventory Count</FormLabel>
                            <Input name="inventory_count" type="number" value={formData.inventory_count} onChange={handleChange} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Pictures</FormLabel>
                            <Input type="file" multiple onChange={handleFilesChangeAppend} />
                        </FormControl>
                        <Grid templateColumns="repeat(auto-fit, minmax(100px, 1fr))" gap={4}>
                            {pictureURLs.map((url, index) => (
                                <Box key={index} position="relative">
                                    <Image
                                        src={url}
                                        alt={`Product ${index + 1}`}
                                        objectFit="cover"
                                        boxSize="100px"
                                        border={index === mainIndex ? "2px solid green" : "none"}
                                        onClick={() => setMainIndex(index)}
                                        cursor="pointer"
                                    />
                                    <IconButton
                                        icon={<CloseIcon />}
                                        size="xs"
                                        position="absolute"
                                        top="2px"
                                        right="2px"
                                        onClick={() => handleRemovePicture(index)}
                                    />
                                </Box>
                            ))}
                        </Grid>
                        <Button type="submit" colorScheme="blue">Submit</Button>
                    </VStack>
                </form>
            </Box>
        </center>
    );
};

export default AddProduct;
