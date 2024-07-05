import React, { useState } from 'react';
import {
  Box, Flex, Avatar, Container, HStack, IconButton, Input, Select, useDisclosure, Drawer, DrawerBody,
  DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, Tooltip, Heading, VStack, Switch,
  useColorMode, Text, Image
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import CartImage from './Cart';
import { getCategoryValue } from '../utils/CategoryEncoder';
import Logo from '../assets/freemarket.png';
import LogoWhite from '../assets/freemarket-white.png';


const categories = [
  'All Categories', 'Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Personal Care', 'Health & Wellness',
  'Toys & Games', 'Sports & Outdoors', 'Automotive', 'Books', 'Music & Movies', 'Office Supplies',
  'Pet Supplies', 'Baby Products', 'Garden & Outdoor', 'Jewelry & Accessories', 'Shoes & Footwear',
  'Handmade Products', 'Groceries', 'Furniture', 'Appliances', 'Tools & Home Improvement', 'Arts & Crafts',
  'Travel & Luggage', 'Smart Home Devices', 'Software', 'Industrial & Scientific', 'Collectibles & Fine Art',
  'Musical Instruments', 'Gift Cards', 'Watches'
];

function DefaultAppBar({ category, setCategory }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchValue !== '') {
      if (getCategoryValue(category)) {
        navigate(`/search?term=${searchValue}&category=${getCategoryValue(category)}`);
      } else {
        navigate(`/search?term=${searchValue}`);
      }
    } else {
      if (getCategoryValue(category)) {
        navigate(`/search?category=${getCategoryValue(category)}`);
      } else {
        navigate('/');
      }
    }
  };

  const handleSearchText = (event) => {
    setSearchValue(event.target.value);
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <Box bg={colorMode === 'dark' ? 'gray.800' : 'blue.500'} px={4}>
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <HStack spacing={4} alignItems="center">
            <Text fontSize="lg" color="white">
              <Link to="/">{colorMode == 'dark' ? <Image src={LogoWhite} height={'32px'} width={'auto'} /> : <Image src={Logo} height={'32px'} width={'auto'} />}</Link>
            </Text>
            <Flex display={{base:'none', lg:'flex'}} alignItems="center" bg="whiteAlpha.200" borderRadius="md" p={1}>
              <IconButton
                aria-label="Search database"
                icon={<SearchIcon />}
                bg="transparent"
                _hover={{ bg: 'transparent' }}
                mr={2}
              />
              <Input
                type="text"
                placeholder="Search…"
                variant="unstyled"
                _placeholder={{ color: 'whiteAlpha.700' }}
                color={colorMode === 'dark' ? "white" : "black"}
                flex="1"
                onChange={handleSearchText}
                value={searchValue}
              />
              <Select
                value={category}
                onChange={handleCategoryChange}
                placeholder="Category"
                variant="unstyled"
                color={colorMode === 'dark' ? "white" : "black"}
                flex="1"
              >
                {categories.map((categorie) => (
                  <option key={categorie} value={categorie}>
                    {categorie}
                  </option>
                ))}
              </Select>
              <Button onClick={handleSearchClick}>
                Search
              </Button>
            </Flex>
          </HStack>
          <Text fontWeight="bold" marginRight={'10px'}>Dark Mode</Text>
          <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
          <HStack spacing={4} alignItems="center">
            <CartImage onClick={handleCartClick} />
            <Tooltip label="Open settings" aria-label="A tooltip">
              <IconButton
                icon={<Avatar size="sm" src="/static/images/avatar/2.jpg" />}
                onClick={onOpen}
                variant="outline"
                borderColor="whiteAlpha.300"
                _hover={{ bg: 'whiteAlpha.200' }}
                _focus={{ bg: 'whiteAlpha.300' }}
              />
            </Tooltip>
          </HStack>
        </Flex>
      </Container>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading size="md">
              <Link to="/">{colorMode == 'dark' ? <Image src={LogoWhite} height={'32px'} width={'auto'} /> : <Image src={Logo} height={'32px'} width={'auto'} />}</Link>
            </Heading>
          </DrawerHeader>
          <DrawerBody>
            <VStack>
              <Button colorScheme="blue" onClick={() => { navigate('/signup'); onClose(); }}>
                Sign Up
              </Button>
              <Button colorScheme="blue" onClick={() => { navigate('/login'); onClose(); }}>
                Login
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default DefaultAppBar;