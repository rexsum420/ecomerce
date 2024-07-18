import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Spinner, Alert, AlertIcon, Heading, Grid, GridItem, Image, Badge, Text, Flex, Button } from "@chakra-ui/react";
import Api from "../utils/Api";
import { getCategoryValue } from '../utils/CategoryEncoder';
import getCategoryLabel from '../utils/CategoryDecoder';
import CategoryScroll from '../components/CategoryScroll';
import PriceAscending from '../assets/price-ascending.png';
import PriceDescending from '../assets/price-descending.png';
import AlphaAscending from '../assets/alpha-ascending.png';
import AlphaDescending from '../assets/alpha-descending.png';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const SearchScreen = () => {
    const query = useQuery();
    const term = query.get('term');
    const category = query.get('category');
    const [prods, setProds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState('');

    const fetchProducts = async () => {
        try {
            let apiUrl = `http://192.168.1.75:8000/api/search/?`;
            if (term) apiUrl += `search=${term}&`;
            if (category) apiUrl += `category=${category}&`;
            const res = await Api(apiUrl.slice(0, -1));
            setProds(res.results);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [term, category]);

    useEffect(() => {
        if (sortOption) {
            const sortedProducts = [...prods].sort((a, b) => {
                if (sortOption === 'price_asc') {
                    return a.price - b.price;
                } else if (sortOption === 'price_desc') {
                    return b.price - a.price;
                } else if (sortOption === 'name_asc') {
                    return a.name.localeCompare(b.name);
                } else if (sortOption === 'name_desc') {
                    return b.name.localeCompare(a.name);
                } else {
                    return 0;
                }
            });
            setProds(sortedProducts);
        }
    }, [sortOption]);

    const handleSortChange = (sortType) => {
        if (sortOption !== sortType) {
        setSortOption(sortType);
        } else {
        setSortOption('');
        }    
    };

    const handleViewDetails = (id) => {
        navigate(`/view-product/${id}`);
    };

    if (loading) {
        return <Spinner size="xl" />;
    }

    if (error) {
        return (
            <Alert status="error">
                <AlertIcon />
                Error fetching products.
            </Alert>
        );
    }

    return (
        <Box p={5}>
            <CategoryScroll term={term} />
            <Flex flexDirection="row" justifyContent="space-between" marginTop={'20px'}>
                <Flex flexDirection="column">
                    {term && term.trim() !== '' && <Heading size="sm" mb={5}>Search Results for "{term}"</Heading>}
                    {category && category.trim() !== '' && <Heading size="sm" mb={5}>Results in category: {getCategoryLabel(category)}</Heading>}
                </Flex>
                <Flex justifyContent="end" alignItems="center">
                    <Image 
                        src={PriceAscending} 
                        alt="Price Ascending" 
                        boxSize="16px" 
                        cursor="pointer" 
                        onClick={() => handleSortChange('price_asc')} 
                        opacity={sortOption === 'price_asc' ? 0.5 : 1}
                    />
                    <Image 
                        src={PriceDescending} 
                        alt="Price Descending" 
                        boxSize="16px" 
                        cursor="pointer" 
                        onClick={() => handleSortChange('price_desc')} 
                        opacity={sortOption === 'price_desc' ? 0.5 : 1}
                        ml={2}
                    />
                    <Image 
                        src={AlphaAscending} 
                        alt="Alpha Ascending" 
                        boxSize="16px" 
                        cursor="pointer" 
                        onClick={() => handleSortChange('name_asc')} 
                        opacity={sortOption === 'name_asc' ? 0.5 : 1}
                        ml={2}
                    />
                    <Image 
                        src={AlphaDescending} 
                        alt="Alpha Descending" 
                        boxSize="16px" 
                        cursor="pointer" 
                        onClick={() => handleSortChange('name_desc')} 
                        opacity={sortOption === 'name_desc' ? 0.5 : 1}
                        ml={2}
                    />
                </Flex>
            </Flex>
            <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
                {prods.map((product) => (
                    <GridItem key={product.id}>
                        <Box
                            borderWidth="1px"
                            borderRadius="lg"
                            overflow="hidden"
                            p={4}
                            m={2}
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            height="100%"
                            position="relative"
                        >
                            <Box position="relative" textAlign="left">
                                <Text fontSize="xl" fontWeight="bold" mb={2}>
                                    {product.name}
                                </Text>
                                <Text fontSize="sm" color="gray.500" mb={2}>
                                    {product.description}
                                </Text>
                                <Badge position="absolute" top={2} right={2} p={1} bg="rgba(0, 0, 0, 0.3)" borderRadius="md" color="white">
                                    <Text fontSize="sm">
                                        {product.store}
                                    </Text>
                                </Badge>
                            </Box>
                            <Box position="relative">
                                <Image
                                    src={product.pictures}
                                    alt={product.name}
                                    maxW="100%"
                                    maxH="200px"
                                    objectFit="contain"
                                    mb={2}
                                />
                                <Badge position="absolute" bottom={2} right={2} p={1} bg="rgba(0, 0, 0, 0.3)" borderRadius="md" color="white">
                                    <Text fontSize="sm">{getCategoryValue(product.category)}</Text>
                                </Badge>
                                <Box display="flex" flexDirection="row" justifyContent="space-between" mt={2}>
                                    <Text fontSize="xl" color="green.500" ml={2}>
                                        ${product.price}
                                    </Text>
                                    <Button colorScheme="blue" onClick={() => handleViewDetails(product.id)}>
                                        View Details
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </GridItem>
                ))}
            </Grid>
        </Box>
    );
};

export default SearchScreen;