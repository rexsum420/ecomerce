import React, { useState, useEffect } from 'react';
import { getCategoryValue } from '../utils/CategoryEncoder';
import useFetchList from '../utils/useFetchList';
import ProductCard from '../components/ProductCard';
import {
  Container,
  Box,
  Select,
  FormControl,
  FormLabel,
  Heading,
  Grid,
  GridItem,
  Center,
  Flex,
} from '@chakra-ui/react';
import CategoryScroll from '../components/CategoryScroll';

const LandingPage = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    if (getCategoryValue(category) == null) {
      setQuery('');
    } else {
      setQuery(`?category=${getCategoryValue(category)}`);
    }
  }, [category]);

  const { data, loading, error } = useFetchList(`http://192.168.1.75:8000/api/homepage/${query}`, 'GET', '', false);

  useEffect(() => {
    if (data && Array.isArray(data.results)) {
      setProducts(data.results);
    } else {
      setProducts([]);
    }
  }, [data]);

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortedProducts = [...products].sort((a, b) => {
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

  if (loading) {
    return <Center>Loading...</Center>;
  }

  if (error) {
    return <Center>Error loading products</Center>;
  }

  return (
    <Container maxW="container.xl">
      <CategoryScroll />
      <Box display="flex" flexDirection="row" justifyContent="space-between" mb={4}>
        <Heading size="lg">{getCategoryValue(category) ? `${category}` : `Products`}</Heading>
        <Box flex="1" ml={4}>
          <FormControl width={{ base: "250px", md: "400px" }}>
            <Flex justifyContent="space-between" alignItems="center">
              <FormLabel>Sort By</FormLabel>
              <Select width={{ base: "180px", md: "300px" }} value={sortOption} onChange={handleSortChange} placeholder="None">
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="name_desc">Name: Z to A</option>
              </Select>
            </Flex>
          </FormControl>
        </Box>
      </Box>
      <Grid 
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)', xl: 'repeat(4, 1fr)' }} 
        gap={6}
      >
        {sortedProducts.map((product) => (
          <GridItem key={product.id}>
            <ProductCard product={product} />
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
};

export default LandingPage;