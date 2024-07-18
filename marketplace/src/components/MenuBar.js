import React, { useState } from 'react';
import {
  Box, Flex, Container, HStack, IconButton, Input, Select, useDisclosure,
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  Button, Tooltip, Text, Switch, useColorMode, VStack, Image
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { Link, useNavigate } from 'react-router-dom';
import CartImage from './Cart';
import { getCategoryValue } from '../utils/CategoryEncoder';
import HomeImage from '../assets/home.png';
import ProfileImage from '../assets/profile.png';
import ProfileLight from '../assets/profile-black.png';
import StoreImage from '../assets/store.png';
import OrderImage from '../assets/order.png';
import PurchaseImage from '../assets/purchase.png';
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

function LoggedInAppBar({ category, setCategory }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const { colorMode, toggleColorMode } = useColorMode();
  const username = localStorage.getItem('username');

  const handleLogOut = () => {
    const temp = localStorage.getItem('chakra-ui-color-mode');
    localStorage.clear();
    localStorage.setItem('chakra-ui-color-mode', temp);
    navigate('/');
    document.location.reload();
  };

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

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleSearchText = (event) => {
    setSearchValue(event.target.value);
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
            display={{ base: 'none', lg: 'flex' }}
          >
            {categories.map((categorie) => (
              <option key={categorie} value={categorie}>
                {categorie}
              </option>
            ))}
          </Select>
          <Flex display={{ base: 'none', lg: 'flex' }}>
            <Text fontWeight="bold" marginRight={'10px'}>Dark Mode</Text>
            <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
          </Flex>
          <HStack spacing={4} alignItems="center">
            <CartImage onClick={handleCartClick} />
            <Tooltip label="Open settings" aria-label="A tooltip">
              <IconButton
                icon={colorMode === 'dark' ? <Image src="../assets/3lines-white.png" boxSize="20px" /> : <Image src="../assets/3lines.png" boxSize="20px" />}
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
              {colorMode === 'dark' ? <Image cursor="pointer" onClick={() => { navigate('/'); onClose(); }} src={LogoWhite} height={'32px'} width={'auto'} /> : <Image cursor="pointer" onClick={() => { navigate('/'); onClose(); }} src={Logo} height={'32px'} width={'auto'} />}
            </Text>
          </DrawerHeader>
          <Flex flexDirection="column" p={'10px'}>
            <Flex justifyContent='center' my='10px'>
              <Text fontWeight="bold" marginRight={'10px'}>Dark Mode</Text>
              <Switch isChecked={colorMode === 'dark'} onChange={toggleColorMode} />
            </Flex>
            <hr />
            <DrawerBody>
              <Flex justifyContent="space-between" height="84vh" direction="column">
                <VStack align="start">
                  <Flex display='flex' flexDirection='row'>
                    <Image src={HomeImage} alt='home' boxSize={'32px'} marginRight={'20px'} />
                    <Button onClick={() => { navigate('/'); onClose(); }}>
                      Home
                    </Button>
                  </Flex>
                  <br />
                  <Flex display='flex' flexDirection='row'>
                    <Image src={colorMode == 'light' ? ProfileLight : ProfileImage} alt='profile' boxSize={'32px'} marginRight={'20px'} />
                    <Button onClick={() => { navigate(`/profile?user=${username}`); onClose(); }}>
                      Profile
                    </Button>
                  </Flex>
                  <br />
                  <Flex display='flex' flexDirection='row'>
                    <Image src={StoreImage} alt='store' boxSize={'32px'} marginRight={'20px'} />
                    <Button onClick={() => { navigate('/stores'); onClose(); }}>
                      Stores
                    </Button>
                  </Flex>
                  <br />
                  <Flex display='flex' flexDirection='row'>
                    <Image src={OrderImage} alt='order' boxSize={'32px'} marginRight={'20px'} />
                    <Button onClick={() => { navigate('/orders'); onClose(); }}>
                      Orders
                    </Button>
                  </Flex>
                  <br />
                  <Flex display='flex' flexDirection='row'>
                    <Image src={PurchaseImage} alt='purchase' boxSize={'32px'} marginRight={'20px'} />
                    <Button onClick={() => { navigate('/purchases'); onClose(); }}>
                      Purchases
                    </Button>
                  </Flex>
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
          </Flex>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default LoggedInAppBar;
