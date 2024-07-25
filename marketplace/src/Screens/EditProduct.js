import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Textarea, Image, VStack, useToast, Select, Grid, IconButton, Spinner, Text } from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { CloseIcon } from '@chakra-ui/icons';
import { useForm, Controller } from 'react-hook-form';

const EditProduct = () => {
    const { id } = useParams();
    const { register, handleSubmit, control, setValue, getValues, formState: { errors } } = useForm();
    const [pictures, setPictures] = useState([]);
    const [pictureURLs, setPictureURLs] = useState([]);
    const [mainIndex, setMainIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [owner, setOwner] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("username");
    if (!token) {
        navigate("/login");
        document.location.reload();
    }

    const fetchProduct = async (id) => {
        const url = `${apiBaseUrl}/api/products/${id}/`;
        const headers = {
            Authorization: `Token ${token}`,
        };

        try {
            const response = await fetch(url, { headers });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            for (const key in data) {
                setValue(key, data[key]);
            }
            setPictures(data.pictures);
            setPictureURLs(data.pictures.map(pic => pic.image));
            if (userId === data.store.owner.username) {
                setOwner(true);
            }
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct(id);
    }, [id]);

    const onSubmit = async (formData) => {
        const token = localStorage.getItem('token');
        formData.price = parseFloat(formData.price);
        formData.inventory_count = parseInt(formData.inventory_count, 10);

        const response = await fetch(`${apiBaseUrl}/api/products/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        if (response.ok) {
            toast({
                title: 'Product updated.',
                description: "Updating pictures now.",
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            handleUpload();
        } else {
            toast({
                title: 'Error updating product.',
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
            formData.append('product', parseInt(id, 10));
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

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <Text>Error: {error}</Text>;
    }

    if (!owner) {
        return <Text>Must be the owner of this product to edit it.</Text>
    }

    return (
        <center>
            <Box p={5} width={{ base: '100%', md: '60%' }} mt="20px">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing={4} align="stretch">
                        <FormControl isRequired>
                            <FormLabel>Name</FormLabel>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => <Input {...field} />}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => <Textarea {...field} />}
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Price</FormLabel>
                            <Controller
                                name="price"
                                control={control}
                                render={({ field }) => <Input type="number" step="0.01" {...field} />}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Size</FormLabel>
                            <Controller
                                name="size"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field}>
                                        <option value="">Select size...</option>
                                        <option value="XS">Extra Small</option>
                                        <option value="S">Small</option>
                                        <option value="M">Medium</option>
                                        <option value="L">Large</option>
                                        <option value="XL">Extra Large</option>
                                        <option value="XXL">Double XL</option>
                                        <option value="XXXL">Triple XL</option>
                                    </Select>
                                )}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Color</FormLabel>
                            <Controller
                                name="color"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field}>
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
                                )}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Variations</FormLabel>
                            <Controller
                                name="variations"
                                control={control}
                                render={({ field }) => <Textarea {...field} />}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Category</FormLabel>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select {...field}>
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
                                        <option value="music_movies">Music & Movies</option>
                                        <option value="office_supplies">Office Supplies</option>
                                        <option value="pet_supplies">Pet Supplies</option>
                                        <option value="baby_products">Baby Products</option>
                                        <option value="garden_outdoor">Garden & Outdoor</option>
                                        <option value="jewelry_accessories">Jewelry & Accessories</option>
                                        <option value="shoes_footwear">Shoes & Footwear</option>
                                        <option value="handmade_products">Handmade Products</option>
                                        <option value="groceries">Groceries</option>
                                        <option value="furniture">Furniture</option>
                                        <option value="appliances">Appliances</option>
                                        <option value="tools_home_improvement">Tools & Home Improvement</option>
                                        <option value="arts_crafts">Arts & Crafts</option>
                                        <option value="travel_luggage">Travel & Luggage</option>
                                        <option value="smart_home_devices">Smart Home Devices</option>
                                        <option value="software">Software</option>
                                        <option value="industrial_scientific">Industrial & Scientific</option>
                                        <option value="collectibles_fine_art">Collectibles & Fine Art</option>
                                        <option value="musical_instruments">Musical Instruments</option>
                                        <option value="gift_cards">Gift Cards</option>
                                        <option value="watches">Watches</option>
                                    </Select>
                                )}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Keywords</FormLabel>
                            <Controller
                                name="keywords"
                                control={control}
                                render={({ field }) => <Textarea {...field} />}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Inventory Count</FormLabel>
                            <Controller
                                name="inventory_count"
                                control={control}
                                render={({ field }) => <Input type="number" {...field} />}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Pictures</FormLabel>
                            <input type="file" multiple onChange={handleFilesChangeAppend} />
                            <Grid templateColumns="repeat(auto-fill, minmax(100px, 1fr))" gap={2} mt={2}>
                                {pictureURLs.map((url, index) => (
                                    <Box key={index} position="relative">
                                        <Image
                                            src={url}
                                            alt={`Preview ${index}`}
                                            objectFit="cover"
                                            boxSize="100px"
                                            border={index === mainIndex ? '3px solid teal' : 'none'}
                                            onClick={() => setMainIndex(index)}
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
                        </FormControl>
                        <Button type="submit" colorScheme="teal">Update Product</Button>
                    </VStack>
                </form>
            </Box>
        </center>
    );
};

export default EditProduct;
