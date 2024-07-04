import React, { useState } from 'react';
import { Box, Flex, Avatar, Container, HStack, IconButton, Input, Select, useDisclosure, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, Tooltip, Heading, VStack, Text } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import CartImage from './Cart';

const categories = [
  'All Categories', 'Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Personal Care', 'Health & Wellness',
  'Toys & Games', 'Sports & Outdoors', 'Automotive', 'Books', 'Music & Movies', 'Office Supplies',
  'Pet Supplies', 'Baby Products', 'Garden & Outdoor', 'Jewelry & Accessories', 'Shoes & Footwear',
  'Handmade Products', 'Groceries', 'Furniture', 'Appliances', 'Tools & Home Improvement', 'Arts & Crafts',
  'Travel & Luggage', 'Smart Home Devices', 'Software', 'Industrial & Scientific', 'Collectibles & Fine Art',
  'Musical Instruments', 'Gift Cards', 'Watches'
];

function LoggedInAppBar({ category, setCategory }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigation = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  
  const handleLogOut = () => {
    localStorage.removeItem('token');
    navigation('/');
    document.location.reload();
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchValue != '') {
    navigation(`/search?term=${searchValue}`);
    } else {
      navigation('/');
    }
  }

  const handleSearchText = (event) => {
    setSearchValue(event.target.value);
  }

  return (
    <Box bg="blue.500" px={2}>
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <HStack spacing={4} alignItems="center">
            <Text fontSize="lg" color="white">
              <Link to="/">Free Market</Link>
            </Text>
            <Flex alignItems="center" bg="whiteAlpha.200" borderRadius="md" p={1}>
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
                color="black"
                flex="1"
                onChange={handleSearchText}
                value={searchValue}
              />
              <Select
                value={category}
                onChange={handleCategoryChange}
                placeholder="Category"
                variant="unstyled"
                color="black"
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
          <HStack spacing={4} alignItems="center">
            <CartImage />
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
        <DrawerContent >
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading size="md">
              <Link to="/">Free Market</Link>
            </Heading>
          </DrawerHeader>
          <hr />
          <DrawerBody>
            <Flex justifyContent="space-between" height="84vh" direction="column">
            <VStack align="start">
              <Button onClick={() => { navigation('/'); onClose(); }}>
                Home
              </Button>
              <Button onClick={() => { navigation('/profile'); onClose(); }}>
                Profile
              </Button>
              <Button onClick={() => { navigation('/stores'); onClose(); }}>
                Stores
              </Button>
              <Button onClick={() => { navigation('/orders'); onClose(); }}>
                Orders
              </Button>
              <Button onClick={() => { navigation('/purchases'); onClose(); }}>
                Purchases
              </Button>
            </VStack>
            <VStack align="center">
              <Flex direction='column'>
              <hr />
            <Button colorScheme="blue" onClick={handleLogOut}>
                Sign Out
              </Button>
              </Flex>
            </VStack>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default LoggedInAppBar;
