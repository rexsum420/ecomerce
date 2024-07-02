import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import InputBase from '@mui/material/InputBase';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { MenuItem as SelectMenuItem, Typography } from '@mui/material';
import CartImage from './Cart';
import { Drawer, Button } from 'rsuite';
import { Link, useNavigate } from 'react-router-dom';

const categories = [
  'All Categories', 'Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Personal Care', 'Health & Wellness',
  'Toys & Games', 'Sports & Outdoors', 'Automotive', 'Books', 'Music & Movies', 'Office Supplies',
  'Pet Supplies', 'Baby Products', 'Garden & Outdoor', 'Jewelry & Accessories', 'Shoes & Footwear',
  'Handmade Products', 'Groceries', 'Furniture', 'Appliances', 'Tools & Home Improvement', 'Arts & Crafts',
  'Travel & Luggage', 'Smart Home Devices', 'Software', 'Industrial & Scientific', 'Collectibles & Fine Art',
  'Musical Instruments', 'Gift Cards', 'Watches'
];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: 'auto',
  display: 'flex',
  alignItems: 'center',
  padding: '0px 0px', // Adjust padding to make it slimmer
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 0), // Adjust padding to make it slimmer
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.5, 1, 0.5, 0), // Adjust padding to make it slimmer
    paddingLeft: `calc(1em + ${theme.spacing(3)})`,
    transition: theme.transitions.create('width'),
    width: '12ch',
    '&:focus': {
      width: '20ch',
    },
  },
}));

function LoggedInAppBar({ category, setCategory }) {
  const [openWithHeader, setOpenWithHeader] = React.useState(false);
  const navigation = useNavigate();
  
  const handleOpenUserMenu = (event) => {
    setOpenWithHeader(true);
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    navigation('/');
    document.location.reload();
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl" sx={{ padding: '0px 0px' }}>
        <Toolbar disableGutters sx={{ padding: '0 0px', minHeight: '40px' }}> {/* Adjust padding and height */}
          <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', p: 1 }}> {/* Adjust padding */}
            <Typography>
              <Link to="/" style={{ textDecoration: 'none', color: 'white', marginRight: '20px' }}> {/* Adjust margin */}
                Free Market
              </Link>
            </Typography>
            <Search style={{ flexGrow: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
              <FormControl variant="outlined" sx={{ minWidth: 240, ml: 1 }}> {/* Adjust minWidth and margin */}
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={category}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  {categories.map((categorie) => (
                    <SelectMenuItem key={categorie} value={categorie}>
                      {categorie}
                    </SelectMenuItem>
                  ))}
                </Select>
              </FormControl>
            </Search>
          </Box>
          <CartImage />
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 1 }}> {/* Adjust padding */}
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Drawer open={openWithHeader} onClose={() => setOpenWithHeader(false)}>
              <Drawer.Header>
                <Drawer.Title><a href="http://localhost:3000/">Free Market</a></Drawer.Title>
                <Drawer.Actions>
                  <Button onClick={() => { handleLogOut(); setOpenWithHeader(false); }} appearance="primary">
                    Sign Out
                  </Button>
                </Drawer.Actions>
              </Drawer.Header>
              <Drawer.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                <Button style={{ width: '30%', margin: '10px' }} onClick={() => { navigation('/'); setOpenWithHeader(false); }}>
                  Home
                </Button>
                <Button style={{ width: '30%', margin: '10px' }} onClick={() => { navigation('/profile'); setOpenWithHeader(false); }}>
                  Profile
                </Button>
                <Button style={{ width: '30%', margin: '10px' }} onClick={() => { navigation('/stores'); setOpenWithHeader(false); }}>
                  Stores
                </Button>
                <Button style={{ width: '30%', margin: '10px' }} onClick={() => { navigation('/orders'); setOpenWithHeader(false); }}>
                  Orders
                </Button>
                <Button style={{ width: '30%', margin: '10px' }} onClick={() => { navigation('/purchases'); setOpenWithHeader(false); }}>
                  Purchases
                </Button>
              </Drawer.Body>
            </Drawer>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default LoggedInAppBar;