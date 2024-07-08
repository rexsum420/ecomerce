import React from 'react';
import { Box, HStack, Text, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { getCategoryValue } from '../utils/CategoryEncoder';
import { useSwipeable } from 'react-swipeable';

const categoryIcons = [
  { name: 'All Categories', icon: require('../assets/category/everything.png') },
  { name: 'Electronics', icon: require('../assets/category/electronics.png') },
  { name: 'Clothing', icon: require('../assets/category/clothing.png') },
  { name: 'Home & Kitchen', icon: require('../assets/category/kitchen.png') },
  { name: 'Beauty & Personal Care', icon: require('../assets/category/beauty.png') },
  { name: 'Health & Wellness', icon: require('../assets/category/health.png') },
  { name: 'Toys & Games', icon: require('../assets/category/games.png') },
  { name: 'Sports & Outdoors', icon: require('../assets/category/outdoors.png') },
  { name: 'Automotive', icon: require('../assets/category/automotive.png') },
  { name: 'Books', icon: require('../assets/category/books.png') },
  { name: 'Music & Movies', icon: require('../assets/category/movies.png') },
  { name: 'Office Supplies', icon: require('../assets/category/office.png') },
  { name: 'Pet Supplies', icon: require('../assets/category/pets.png') },
  { name: 'Baby Products', icon: require('../assets/category/baby.png') },
  { name: 'Garden & Outdoor', icon: require('../assets/category/garden.png') },
  { name: 'Jewelry & Accessories', icon: require('../assets/category/jewelery.png') },
  { name: 'Shoes & Footwear', icon: require('../assets/category/footware.png') },
  { name: 'Handmade Products', icon: require('../assets/category/homemade.png') },
  { name: 'Groceries', icon: require('../assets/category/groceries.png') },
  { name: 'Furniture', icon: require('../assets/category/furniture.png') },
  { name: 'Appliances', icon: require('../assets/category/appliances.png') },
  { name: 'Tools & Home Improvement', icon: require('../assets/category/tools.png') },
  { name: 'Arts & Crafts', icon: require('../assets/category/crafts.png') },
  { name: 'Travel & Luggage', icon: require('../assets/category/luggage.png') },
  { name: 'Smart Home Devices', icon: require('../assets/category/smartdevice.png') },
  { name: 'Software', icon: require('../assets/category/software.png') },
  { name: 'Industrial & Scientific', icon: require('../assets/category/industrial.png') },
  { name: 'Collectibles & Fine Art', icon: require('../assets/category/fineart.png') },
  { name: 'Musical Instruments', icon: require('../assets/category/instruments.png') },
  { name: 'Gift Cards', icon: require('../assets/category/giftcards.png') },
  { name: 'Watches', icon: require('../assets/category/watches.png') },
];

const CategoryScroll = ({term}) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    if (term) {
        if (getCategoryValue(category)) {
            navigate(`/search?term=${term}&category=${getCategoryValue(category)}`);
            } else {
            navigate(`/search?term=${term}`);
        }
    }else {
    if (getCategoryValue(category)) {
    navigate(`/search?category=${getCategoryValue(category)}`);
    } else {
    navigate('/');
    }
}
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => document.getElementById('category-scroll-container').scrollBy({ left: 200, behavior: 'smooth' }),
    onSwipedRight: () => document.getElementById('category-scroll-container').scrollBy({ left: -200, behavior: 'smooth' }),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <Box id="category-scroll-container" overflowX="auto" padding="8px 16px" {...swipeHandlers}>
      <style>
        {`
          #category-scroll-container::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <HStack spacing={4}>
        {categoryIcons.map((category, index) => (
          <Box key={index} textAlign="center" onClick={() => handleCategoryClick(category.name)} cursor="pointer" mx={"20px"}>
            <Image src={category.icon} alt={category.name} boxSize="50px" marginBottom="8px" />
            <Text fontSize="12px">{category.name}</Text>
          </Box>
        ))}
      </HStack>
    </Box>
  );
};

export default CategoryScroll;