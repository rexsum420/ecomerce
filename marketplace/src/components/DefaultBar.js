import React, { useState } from 'react';
import {
  Box, Flex, Container, HStack, IconButton, Input, Select, useDisclosure, Drawer, DrawerBody,
  DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, Tooltip, VStack, Switch,
  useColorMode, Text, Image
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import CartImage from './Cart';
import { getCategoryValue } from '../utils/CategoryEncoder';
import Logo from '../assets/freemarket.png';
import LogoWhite from '../assets/freemarket-white.png';
import smLogo from '../assets/fm.png';
import smLogoWhite from '../assets/fm-white.png';


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
    <Box 
      bg={colorMode === 'dark' ? 'black' : 'blue.500'} 
      px={2}
      shadow='lg'
      borderBottom='1px solid'
      borderColor='gray.500'
      >
      <Container maxW="container.xl">
        <Flex h={16} alignItems="center" justifyContent="space-between">
          <HStack spacing={4} alignItems="center">
          <Box display={{ base: 'none', lg: 'block' }}>
            <Link to="/">
              <Image src={colorMode === 'dark' ? LogoWhite : Logo} height="32px" width="auto" />
            </Link>
          </Box>
          <Box display={{ base: 'block', lg: 'none' }}>
            <Link to="/">
              <Image src={colorMode === 'dark' ? smLogoWhite : smLogo} height="32px" width="auto" />
            </Link>
          </Box>
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
                color={colorMode === 'dark' ? "white" : "black"}
                flex="1"
                onChange={handleSearchText}
                value={searchValue}
              />
              <Button marginLeft='10px' onClick={handleSearchClick}>
                Search
              </Button>
            </Flex>
          </HStack>
          <Select
                value={category}
                onChange={handleCategoryChange}
                placeholder="Category"
                variant="unstyled"
                color={colorMode === 'dark' ? "white" : "black"}
                flex="1"
                marginLeft='50px'
                display={{base:'none', lg:'flex'}}
              >
                {categories.map((categorie) => (
                  <option key={categorie} value={categorie}>
                    {categorie}
                  </option>
                ))}
              </Select>
          <Flex display={{base:'none', lg:'flex'}}>
          <Text fontWeight="bold" marginRight={'10px'}>Dark Mode</Text>
          <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
          </Flex>
          <HStack spacing={4} alignItems="center">
            <CartImage onClick={handleCartClick} />
            <Tooltip label="Open settings" aria-label="A tooltip">
              <IconButton
                icon={colorMode === 'dark' ? <Image src="../assets/3lines-white.png" boxSize="20px" /> :<Image src="../assets/3lines.png" boxSize="20px" />}
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
          <DrawerHeader bg={colorMode === 'dark' ? 'black' : 'blue.500'} borderBottom='1px solid' borderColor="gray.500">
            <Text fontSize="lg">
              <Link to="/">{colorMode === 'dark' ? <Image src={LogoWhite} height={'32px'} width={'auto'} /> : <Image src={Logo} height={'32px'} width={'auto'} />}</Link>
            </Text>
          </DrawerHeader>
          <Flex flexDirection="column" p={'10px'}>
          <Flex justifyContent='center' my='10px'>
          <Text fontWeight="bold" marginRight={'10px'}>Dark Mode</Text>
          <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
          </Flex>
          <hr />
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
          </Flex>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default DefaultAppBar;