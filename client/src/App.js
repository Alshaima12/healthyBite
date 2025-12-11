import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Login from './components/Login';
import Signup from './components/Signup';
import Welcome from './components/Welcome';
import Menu from './components/Menu';
import Meals from './components/Meals';
import Drinks from './components/Drinks';
import Cart from './components/Cart';
import OrderComplete from './components/OrderComplete';
import Profile from './components/Profile';
import OrderReceipt from './components/OrderReceipt';
import "index.css"

function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        {/* public */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* logged-in pages */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/meals" element={<Meals />} />
        <Route path="/drinks" element={<Drinks />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-receipt" element={<OrderReceipt />} />
        <Route path="/order-complete" element={<OrderComplete />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
