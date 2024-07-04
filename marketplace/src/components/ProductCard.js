import React from "react";
import { Box, Text, Button, Image, Badge, useTheme } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import getCategoryLabel from "../utils/CategoryDecoder";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleViewDetails = (id) => {
    navigate(`/view-product/${id}`);
  };

  return (
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
  );
};

export default ProductCard;