import React, { useState, useEffect } from "react";
import { Box, Spinner, Alert, AlertIcon, Heading, Text, Grid, GridItem, Image, Button } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import Api from "../utils/Api";

const StoreScreen = () => {
    const { id } = useParams();
    const [store, setStore] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [unAuth, setUnAuth] = useState(false);
    const [prods, setProds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const baseUrl = process.env.REACT_APP_BASE_URL;

    const fetchStore = async (storeId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${apiBaseUrl}/api/stores/${storeId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            });
        
            if (response.status === 401) {
                console.log("Unauthorized");
                setUnAuth(true);
                setLoading(false);
            } else if (response.ok) {
                const data = await response.json();
                setStore(data);
                setLoading(false);
            } else {
                console.error("Error fetching store:", response.statusText);
                setError(true);
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching store:", error);
            setError(true);
            setLoading(false);
        }
    }

    const fetchProducts = async (page) => {
        try {
            const res = await Api(`${apiBaseUrl}/api/products/?store=${id}&page=${page}`);
            setProds(res.results);
            setTotalPages(Math.ceil(res.count / 25)); // Assuming 25 products per page
            console.log(res.results);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStore(id);
        fetchProducts(currentPage);
    }, [currentPage]);

    if (loading) {
        return <Spinner size="xl" />;
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                Error fetching store.
            </Alert>
        );
    }

    if (unAuth) {
        return (
            <Alert status="error">
                <AlertIcon />
                Unauthorized access.
            </Alert>
        );
    }

    const handleAddProduct = () => {
        window.location.href = `${baseUrl}/store/${id}/add-product`;
    };

    const handleEditStore = () => {
        window.location.href = `${baseUrl}/store/${id}/edit`;
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <Box p={5}>
            <Heading as="h1" mb={5}>Store Details</Heading>
            <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                <Box display='flex' flexDirection='row' justifyContent='space-between'>
                    <Box>
                        <Heading fontSize="xl">
                            {store.name}
                        </Heading>
                        <Text fontSize="md" color="gray.500">
                            {store.description}
                        </Text>
                    </Box>
                    <Button onClick={handleEditStore} colorScheme="blue">Edit Store</Button>
                </Box>
                <Box display='flex' flexDirection='row' justifyContent='space-between' mt={4}>
                    <Box>
                        <Text fontSize="md"><a href={store.website} target="_blank" rel="noopener noreferrer">{store.website}</a> </Text>
                    </Box>
                    <Box>
                        <Text fontSize="md"><a href={`tel:${store.phone}`}>{store.phone}</a></Text>
                    </Box>
                </Box>
            </Box>

            <Box display='flex' flexDirection='row' justifyContent='end' mt={'40px'}>
                <Button onClick={handleAddProduct} colorScheme="green">Add Product</Button>
            </Box>
            <Grid px='20px' templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }} gap={6}>
                {prods.map((product) => {
                    const mainPicture = product.pictures.find(picture => picture.main);
                    return (
                        <GridItem key={product.id}>
                            <Box shadow="md" borderWidth="1px" borderRadius="md" p={5} height="100%">
                                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                                    <Box>
                                        <Heading fontSize="xl" mb={2}>{product.name}</Heading>
                                        {mainPicture && <Image src={mainPicture.image} alt={mainPicture.alt || product.name} />}
                                        <Text mt={2}>{product.description}</Text>
                                    </Box>
                                    <Box>
                                        <Text mt={2} color="green.500">${product.price}</Text>
                                        <Button mt={2} colorScheme="teal" onClick={() => navigate(`/view-product/${product.id}`)}>View Product</Button>
                                    </Box>
                                </Box>
                            </Box>
                        </GridItem>
                    );
                })}
            </Grid>
            <Box display='flex' justifyContent='center' mt={5}>
                <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                    mr={2}
                >
                    Previous
                </Button>
                <Text mx={2}>{currentPage} of {totalPages}</Text>
                <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    isDisabled={currentPage === totalPages}
                    ml={2}
                >
                    Next
                </Button>
            </Box>
        </Box>
    );
};

export default StoreScreen;
