import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './component/Navbar/Navbar';
import Footer from './component/Footer/Footer';
import LoginPopup from './component/LoginPopup/LoginPopup';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import MyOrders from './pages/MyOrders/MyOrders';
import Verify from './pages/Verify/Verify';
import About from './pages/About/About';
import FoodItemDetails from './pages/FoodItemDetails/FoodItemDetails';
import UserTables from './pages/UserTables/UserTables';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 🟡 Random background color logic
  useEffect(() => {
    const colors = ['#f5f5f5', '#e6f7ff', '#fff0f5', '#f0fff0', '#fdf6e3'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.body.style.backgroundColor = randomColor;
  }, []);

  return (
    <>
      <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} setSearchQuery={setSearchQuery} />
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
         <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/about" element={<About />} />
          <Route path="/UserTables" element={<UserTables />} />
          <Route path="/product/:id" element={<FoodItemDetails />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
