import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import LoggedInAppBar from './components/MenuBar';
import DefaultAppBar from './components/DefaultBar';
import HomeScreen from './Screens/HomeScreen';
import LandingPage from './Screens/LandingPage';
import LoginScreen from './Screens/LoginScreen';
import SignUpScreen from './Screens/SignUpScreen';
import StoreScreen from './Screens/StoreScreen';
import ListStoreScreen from './Screens/ListStoreScreen';
import SearchScreen from './Screens/SearchScreen';
import AddStore from './Screens/AddStore';
import AddProduct from './Screens/AddProduct';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'rsuite/dist/rsuite.min.css';
import ProductScreen from './Screens/ProductScreen';
import EditStore from './Screens/EditStore';
import ViewCart from './Screens/ViewCart';
import PublicViewStore from './Screens/PublicViewStore';
import EditProduct from './Screens/EditProduct';
import Profile from './Screens/Profile';
import Checkout from './Screens/Checkout';
import AddShipping from './Screens/AddShipping';
import Payment from './Screens/Payment';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [category, setCategory] = useState('');

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`http://192.168.1.75:8000/check/${token}/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            const resdata = await response.json();
            setIsLoggedIn(true);
            localStorage.setItem('username', resdata.user);
          } else {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
          }
        } catch (error) {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      }
    };

    checkToken();
  }, []);

  return (
    <Router>
      <div className="App">
        {isLoggedIn ? 
          <LoggedInAppBar category={category} setCategory={setCategory} /> 
          : 
          <DefaultAppBar category={category} setCategory={setCategory} />
        }
        <Routes>
          <Route path="/" element={isLoggedIn ? <HomeScreen category={category} setCategory={setCategory}/> : <LandingPage category={category} />} />
          <Route path="/login" element={isLoggedIn ? <HomeScreen category={category} setCategory={setCategory}/> : <LoginScreen />} />
          <Route path="/signup" element={isLoggedIn ? <HomeScreen category={category} setCategory={setCategory}/> : <SignUpScreen />} />
          <Route path="/view-product/:id" element={isLoggedIn ? <ProductScreen /> : <LoginScreen />} />
          <Route path="/edit-product/:id" element={isLoggedIn ? <EditProduct /> : <LoginScreen />} />
          <Route path="/stores" element={isLoggedIn ? <ListStoreScreen /> : <LoginScreen />} />
          <Route path="/stores/:name" element={<PublicViewStore />} />
          <Route path="/store/:storeId/edit" element={isLoggedIn ? <EditStore /> : <LoginScreen />} />
          <Route path="/store/:id/add-product" element={isLoggedIn ? <AddProduct /> : <LoginScreen />} />          
          <Route path="/store/:id" element={isLoggedIn ? <StoreScreen /> : <LoginScreen />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/create-store" element={isLoggedIn ? <AddStore /> : <LoginScreen />} />
          <Route path="/cart" element={isLoggedIn ? <ViewCart /> : <LoginScreen />} />
          <Route path="/checkout" element={isLoggedIn ? <Checkout /> : <LoginScreen />} />
          <Route path="/add-shipping" element={isLoggedIn ? <AddShipping /> : <LoginScreen />} />
          <Route path="/payment" element={isLoggedIn ? <Payment /> : <LoginScreen />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
