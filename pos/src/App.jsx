// ✅ App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Tables from './pages/Tables/Tables';
import Menu from './pages/Menu/Menu';
import Cart from './pages/Cart/Cart';
import Kitchen from './pages/Kitchen/Kitchen';
import Orders from './pages/Orders/Orders';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import './App.css';
import AuthForm from './components/Auth/AuthForm';


const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/tables" element={<Tables />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/kitchen" element={<Kitchen />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/auth/:role" element={<AuthForm />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;