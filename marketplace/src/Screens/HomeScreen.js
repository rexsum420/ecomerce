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
  Button,
  IconButton,
  Tooltip,
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
  const [totalPages, setTotalPages] = useState(1);
  const { colorMode } = useColorMode();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const PRODUCTS_PER_PAGE = 24;

  useEffect(() => {
    if (getCategoryValue(category) == null) {
      setQuery('');
    } else {
      setQuery(`?category=${getCategoryValue(category)}`);
    }
  }, [category]);

  const { data, loading, error } = useFetchList(
    `${apiBaseUrl}/api/homepage/${query ? query + `&page=${currentPage}` : `?page=${currentPage}`}`,
    'GET',
    '',
    true
  );

  useEffect(() => {
    if (data && Array.isArray(data.results)) {
      setProducts(data.results);
      setTotalPages(Math.ceil(data.count / PRODUCTS_PER_PAGE));
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
            <Tooltip label="Sort by price: Lowest to highest" aria-label="Sort by price ascending">
              <Image 
                src={PriceAscending} 
                alt="Price Ascending" 
                boxSize="16px" 
                cursor="pointer" 
                onClick={() => handleSortChange('price_asc')} 
                opacity={sortOption === 'price_asc' ? 0.5 : 1}
              />
            </Tooltip>
            <Tooltip label="Sort by price: Highest to lowest" aria-label="Sort by price descending">
              <Image 
                src={PriceDescending} 
                alt="Price Descending" 
                boxSize="16px" 
                cursor="pointer" 
                onClick={() => handleSortChange('price_desc')} 
                opacity={sortOption === 'price_desc' ? 0.5 : 1}
                ml={2}
              />
            </Tooltip>
            <Tooltip label="Sort by name: A-Z" aria-label="Sort by name ascending">
              <Image 
                src={colorMode === 'dark' ? AlphaAscendingWhite : AlphaAscending} 
                alt="Alpha Ascending" 
                boxSize="16px" 
                cursor="pointer" 
                onClick={() => handleSortChange('name_asc')} 
                opacity={sortOption === 'name_asc' ? 0.5 : 1}
                ml={2}
              />
            </Tooltip>
            <Tooltip label="Sort by name: Z-A" aria-label="Sort by name descending">
              <Image 
                src={colorMode === 'dark' ? AlphaDescendingWhite : AlphaDescending} 
                alt="Alpha Descending" 
                boxSize="16px" 
                cursor="pointer" 
                onClick={() => handleSortChange('name_desc')} 
                opacity={sortOption === 'name_desc' ? 0.5 : 1}
                ml={2}
              />
            </Tooltip>
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
        <Flex justifyContent="center" mt={4}>
          <IconButton
            icon={'<'}
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
            mr={2}
            color={colorMode === 'dark' ? 'white' : 'black'}
          />
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              isActive={currentPage === index + 1}
              mx={1}
              color={colorMode === 'dark' ? 'white' : 'black'}
            >
              {index + 1}
            </Button>
          ))}
          <IconButton
            icon={'>'}
            onClick={() => handlePageChange(currentPage + 1)}
            isDisabled={currentPage === totalPages}
            color={colorMode === 'dark' ? 'white' : 'black'}
            ml={2}
          />
        </Flex>
      </Box>
    </Container>
  );
};

export default HomeScreen;
