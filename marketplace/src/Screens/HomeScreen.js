import React, { useState, useEffect } from 'react';
import { getCategoryValue } from '../utils/CategoryEncoder';
import useFetchList from '../utils/useFetchList';
import ProductCard from '../components/ProductCard';
import {
  Box,
  Container,
  FormControl,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Text,
  Flex,
  Image,
  Button
} from '@chakra-ui/react';
import CategoryScroll from '../components/CategoryScroll';
import PriceAscending from '../assets/price-ascending.png';
import PriceDescending from '../assets/price-descending.png';
import AlphaAscending from '../assets/alpha-ascending.png';
import AlphaDescending from '../assets/alpha-descending.png';
import AlphaAscendingWhite from '../assets/alpha-ascending-white.png';
import AlphaDescendingWhite from '../assets/alpha-descending-white.png';
import { useColorMode } from '@chakra-ui/react';

const HomeScreen = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (getCategoryValue(category) == null) {
      setQuery('');
    } else {
      setQuery(`?category=${getCategoryValue(category)}`);
    }
  }, [category]);

  const { data, loading, error } = useFetchList(
    `http://192.168.1.75:8000/api/homepage/${query ? query + `&page=${currentPage}` : `?page=${currentPage}`}`,
    'GET',
    '',
    true
  );

  useEffect(() => {
    if (data && Array.isArray(data.results)) {
      setProducts(data.results);
      setNextPage(data.next);
      setPreviousPage(data.previous);
    } else {
      setProducts([]);
    }
  }, [data]);

  const handleSortChange = (sortType) => {
    setSortOption(sortType);
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
    return <Spinner />;
  }

  if (error) {
    return <Text>Error loading products</Text>;
  }

  return (
    <Container maxW="container.xl" mt={4}>
      <CategoryScroll />
      <Box marginTop={'20px'} display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Heading size="sm">
          {getCategoryValue(category) != null ? `${category}` : `Products`}
        </Heading>
        <FormControl width={{ base: "250px", md: "400px" }}>
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
              src={colorMode === 'dark' ? AlphaAscendingWhite : AlphaAscending} 
              alt="Alpha Ascending" 
              boxSize="16px" 
              cursor="pointer" 
              onClick={() => handleSortChange('name_asc')} 
              opacity={sortOption === 'name_asc' ? 0.5 : 1}
              ml={2}
            />
            <Image 
              src={colorMode === 'dark' ? AlphaDescendingWhite : AlphaDescending} 
              alt="Alpha Descending" 
              boxSize="16px" 
              cursor="pointer" 
              onClick={() => handleSortChange('name_desc')} 
              opacity={sortOption === 'name_desc' ? 0.5 : 1}
              ml={2}
            />
          </Flex>
        </FormControl>
      </Box>
      <Box display='flex' flexDirection='column' height='100vh' padding='8px 16px'>
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
        <Flex justifyContent="space-between" mt={4}>
          <Button 
            onClick={() => setCurrentPage(currentPage - 1)} 
            isDisabled={!previousPage}
          >
            Previous
          </Button>
          <Button 
            onClick={() => setCurrentPage(currentPage + 1)} 
            isDisabled={!nextPage}
          >
            Next
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default HomeScreen;
