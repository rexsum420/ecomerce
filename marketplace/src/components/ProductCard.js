import React from "react";
import { Paper, Typography, Button, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import getCategoryLabel from "../utils/CategoryDecoder";

const ProductCardContainer = styled(Paper)(({ theme }) => ({
  position: 'relative', // Ensure container is relative for absolute positioning inside it
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
}));

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleViewDetails = (id) => {
    navigate(`/view-product?id=${id}`);
  };

  return (
    <ProductCardContainer elevation={3}>
      <Box position="relative" style={{ textAlign: 'left'}}>
        <Typography variant="h5" component="h2" gutterBottom>
        <small>{product.name}</small>
        </Typography>
        <Typography variant="body2" color="textSecondary" paragraph>
          {product.description}
        </Typography>
        <Box position="absolute" top={0} right={0} p={1} bgcolor="rgba(0, 0, 0, 0.3)" borderRadius="5px">
          <Typography variant="body2" color="textSecondary">
            <b>{product.store}</b>
          </Typography>
        </Box>
      </Box>
      <Box position="relative">
        <img src={product.pictures} alt={product.name} style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }} />
        <Box position="absolute" bottom={0} right={0} p={1} bgcolor="rgba(0, 0, 0, 0.3)" borderRadius="5px">
          <Typography variant="body2" color="textSecondary">
            {getCategoryLabel(product.category)}
          </Typography>
        </Box>
        <Box style={{ display: "flex", flexDirection: 'row', justifyContent: "space-between", marginTop: '10px'}}>
        <Typography variant="h5" component="p" color="green" gutterBottom style={{marginLeft: 20}}>
          ${product.price}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => handleViewDetails(product.id)}>
          View Details
        </Button>
        </Box>
        <Box>
            <br />
            <br />
            <br />
        </Box>
      </Box>
    </ProductCardContainer>
  );
};

export default ProductCard;
