import React, { useState } from 'react';
import { Box, Flex, Avatar, Container, HStack, IconButton, Input, Select, useDisclosure, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, Tooltip, Heading, VStack } from '@chakra-ui/react';
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

function DefaultAppBar({ category, setCategory }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigation = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchValue !== '') {
    navigation(`/search?term=${searchValue}`);
    } else {
      navigation('/');
    }
  }
  const handleSearchText = (event) => {
    setSearchValue(event.target.value);
  }


  return (
    <Box bg="blue.500" px={4}>
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <HStack spacing={8} alignItems="center">
            <Box>
              <HStack>
                <Box position="relative">
                  <IconButton
                    aria-label="Search database"
                    icon={<SearchIcon />}
                    bg="transparent"
                    _hover={{ bg: 'transparent' }}
                    position="absolute"
                    top="50%"
                    left="0"
                    transform="translateY(-50%)"
                    zIndex={1}
                  />
                  <Input
                    type="text"
                    placeholder="Search…"
                    pl="2.5rem"
                    borderColor="whiteAlpha.300"
                    _placeholder={{ color: 'whiteAlpha.700' }}
                    _hover={{ borderColor: 'whiteAlpha.500' }}
                    _focus={{ borderColor: 'whiteAlpha.700' }}
                    onChange={{handleSearchText}}
                    value={searchValue}
                  />
                </Box>
                <Select
                  value={category}
                  onChange={handleCategoryChange}
                  placeholder="Category"
                  variant="filled"
                  borderColor="whiteAlpha.300"
                  _hover={{ borderColor: 'whiteAlpha.500' }}
                  _focus={{ borderColor: 'whiteAlpha.700' }}
                  color="black"
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
              </HStack>
            </Box>
          </HStack>
          <HStack spacing={8} alignItems="center">
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
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading size="md">
              <Link to="/">Free Market</Link>
            </Heading>
          </DrawerHeader>
          <DrawerBody>
            <VStack>
              <Button colorScheme="blue" onClick={() => { navigation('/signup'); onClose(); }}>
                Sign Up
              </Button>
              <Button colorScheme="blue" onClick={() => { navigation('/login'); onClose(); }}>
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
