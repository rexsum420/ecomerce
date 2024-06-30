import React, { useState, useEffect } from 'react';
import useFetchList from '../utils/useFetchList';
import ProductCard from '../components/ProductCard';
import { Grid, Container } from '@mui/material';

const HomeScreen = ({ category }) => {
  const [products, setProducts] = useState([]);
  const query = category ? `?category=${category}` : '';
  const { data, loading, error } = useFetchList(`http://192.168.1.75:8000/api/homepage/${query}`, 'GET', '', true);

  useEffect(() => {
    if (data && Array.isArray(data.results)) {
      setProducts(data.results);
      console.log('Products:', data.results);
    } else {
      setProducts([]);
    }
  }, [data]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products</div>;
  }

  return (
    <Container>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomeScreen;