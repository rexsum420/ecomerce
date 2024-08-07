import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Image,
  Spinner,
  Text,
  Heading,
  VStack,
  HStack,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import AddToCartButton from "../components/AddToCartButton";
import getCategoryLabel from "../utils/CategoryDecoder";

const ProductScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [owner, setOwner] = useState(false);
  const navigate = useNavigate();
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("username");
  if (!token) {
    navigate("/login");
    document.location.reload();
  }

  const fetchProduct = async (id) => {
    const url = `${apiBaseUrl}/api/products/${id}/`;
    const headers = {
      Authorization: `Token ${token}`,
    };

    try {
      const response = await fetch(url, { headers });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProduct(data);
      if (userId === data.store.owner.username) {
        setOwner(true);
      }
      setSelectedImage(data.pictures.find((picture) => picture.main) || data.pictures[0]);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  const flexDirection = useBreakpointValue({ base: "column", md: "row" });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const handleEditClick = () => {
    navigate(`/edit-product/${id}`);
  };

  const category = getCategoryLabel(product.category);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt="100px" flexDirection="column">
      <Card display="flex" flexDirection={flexDirection} width="80%" shadow="md">
        <VStack width={{ base: "100%", md: "50%" }} mb={{ base: 4, md: 0 }}>
          <Image src={selectedImage.image} alt={selectedImage.alt} height={{ base: "200px", md: "400px" }} objectFit="contain" />
          <HStack mt="10px">
            {product.pictures.map((picture, index) => (
              <Image
                key={index}
                src={picture.image}
                alt={picture.alt}
                width="100px"
                height="100px"
                objectFit="contain"
                mx="10px"
                cursor="pointer"
                border={selectedImage.image === picture.image ? "2px solid #3182CE" : "none"}
                onClick={() => setSelectedImage(picture)}
              />
            ))}
          </HStack>
        </VStack>
        <VStack width={{ base: "100%", md: "50%" }} justifyContent="space-between" alignItems="flex-start">
          <CardBody style={{ textAlign: 'left' }}>
            <Text color="#FF8000" fontSize="1rem" letterSpacing="2px" mb="4">
              <small>{product.store.name}</small>
            </Text>
            <Heading as="h1" size="lg" mb="4">
              <b>{product.name}</b>
            </Heading>
            <Text mb="4">{product.description}</Text>
            <Text mb="2">Category: {category}</Text>
            <Heading as="h6" size="md" color="green">
              ${product.price}
            </Heading>
          </CardBody>
          <CardFooter justifyContent="center" alignItems="center" width="100%">
            <AddToCartButton product={product} />
          </CardFooter>
        </VStack>
      </Card>
      {owner && <Button mt="20px" onClick={handleEditClick}>Edit Product</Button>}
    </Box>
  );
};

export default ProductScreen;