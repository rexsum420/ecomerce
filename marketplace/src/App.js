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
import { useState } from 'react';
import 'rsuite/dist/rsuite.min.css';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');
  const [category, setCategory] = useState('');

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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
