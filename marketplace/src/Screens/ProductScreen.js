import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Spinner,
  Text,
  Heading,
  VStack,
  HStack,
} from "@chakra-ui/react";
import AddToCartButton from "../components/AddToCartButton";
import getCategoryLabel from "../utils/CategoryDecoder";

const ProductScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    document.location.reload();
  }

  const fetchProduct = async (id) => {
    const url = `http://192.168.1.75:8000/api/products/${id}/`;
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
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct(id);
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  const category = getCategoryLabel(product.category);
  const mainPicture = product.pictures.find((picture) => picture.main) || product.pictures[0];
  const otherPictures = product.pictures.filter((picture) => picture !== mainPicture);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" mt="100px">
      <Card display="flex" flexDirection="row" width="80%" height="60%" shadow="md">
        <VStack width="50%">
          <Image src={mainPicture.image} alt={mainPicture.alt} height="400px" objectFit="contain" />
          <HStack mt="10px">
            {otherPictures.map((picture, index) => (
              <Image
                key={index}
                src={picture.image}
                alt={picture.alt}
                width="100px"
                height="100px"
                objectFit="contain"
                mx="10px"
              />
            ))}
          </HStack>
        </VStack>
        <VStack width="50%" padding="50px" justifyContent="space-between" alignItems="flex-start">
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
          <CardFooter justifyContent="center" alignItems="center">
            <AddToCartButton product={product} />
          </CardFooter>
        </VStack>
      </Card>
    </Box>
  );
};

export default ProductScreen;
