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
import { MenuItem as SelectMenuItem } from '@mui/material';
import Cart from './Cart';
import { Drawer, Button } from 'rsuite';
import { Link, useNavigate } from 'react-router-dom';

const settings = ['Login', 'Sign Up'];
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
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
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
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
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
    navigation('/')
  }

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', p:2 }}>
            <Search style={{ flexGrow: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            <FormControl variant="outlined" sx={{ minWidth: 320, ml: 2 }}>
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
        
          <Box sx={{ flexGrow: 0 }}>
          <Cart />
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 2 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
    <Drawer open={openWithHeader} onClose={() => setOpenWithHeader(false)}>
        <Drawer.Header>
          <Drawer.Title><a href="http://localhost:3000/">Marketplace</a></Drawer.Title>
          <Drawer.Actions>
            <Button onClick={() => {handleLogOut(); setOpenWithHeader(false);}} appearance="primary">
              Sign Out
            </Button>
          </Drawer.Actions>
        </Drawer.Header>
        <Drawer.Body>
          <Button onClick={()=>{navigation('/'); setOpenWithHeader(false);} }>
            Home
          </Button>
          <Button onClick={()=>{navigation('/profile'); setOpenWithHeader(false);} }>
            Home
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
