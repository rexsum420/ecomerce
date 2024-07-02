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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'rsuite/dist/rsuite.min.css';
import ProductScreen from './Screens/ProductScreen';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [category, setCategory] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`http://192.168.1.75:8000/check/${token}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.status === 200) {
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        });
    }
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
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignUpScreen />} />
          <Route path="/view-product/:id" element={<ProductScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;