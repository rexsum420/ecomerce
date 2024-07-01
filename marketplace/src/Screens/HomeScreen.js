import React, { useState, useEffect } from 'react';
import { getCategoryValue } from '../utils/CategoryEncoder';
import useFetchList from '../utils/useFetchList';
import ProductCard from '../components/ProductCard';
import { Grid, Container, Select, MenuItem, FormControl, InputLabel, Grow } from '@mui/material';
import { Box } from '@mui/material';

const HomeScreen = ({ category }) => {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    if (getCategoryValue(category) == null) {
      setQuery('');
    } else {
      setQuery(`?category=${getCategoryValue(category)}`);
    }
  }, [category]);

  const { data, loading, error } = useFetchList(`http://192.168.1.75:8000/api/homepage/${query}`, 'GET', '', true);

  useEffect(() => {
    if (data && Array.isArray(data.results)) {
      setProducts(data.results);
    } else {
      setProducts([]);
    }
  }, [data]);

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === 'price_asc') {
      return a.price - b.price;
    } else if (sortOption === 'price_desc') {
      return b.price - a.price;
    } else if (sortOption === 'name_asc') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'name_desc') {
      return b.name.localeCompare(a.name);
    } else {
      return 0;
    }
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading products</div>;
  }

  return (
    <Container>
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <div style={{ width:'100%'}}>
            <small><h1>{(getCategoryValue(category) != null) ? `${category}` : `Products`}</h1></small>
        </div>
        <div style={{ width:'60%'}}></div>
      <Box style={{ width: '100%'}}>
      <FormControl variant="outlined" fullWidth margin="dense">
        <InputLabel style={{ height: '20px'}} id="sort-select-label">Sort By</InputLabel>
        <Select
          labelId="sort-select-label"
          id="sort-select"
          value={sortOption}
          onChange={handleSortChange}
          label="Sort By"
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="price_asc">Price: Low to High</MenuItem>
          <MenuItem value="price_desc">Price: High to Low</MenuItem>
          <MenuItem value="name_asc">Name: A to Z</MenuItem>
          <MenuItem value="name_desc">Name: Z to A</MenuItem>
        </Select>
      </FormControl>
      </Box>
      </div>
      <Grid style={{ marginTop:'20px' }} container spacing={2}>
        {sortedProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HomeScreen;