// src/App.jsx
import React from 'react';
import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Add from './pages/Add/Add';
import List from './pages/List/List';
import Orders from './pages/Orders/Orders';
import Table from './pages/Table/Table';
import Inventory from './pages/Inventory/Inventory';
import Staff from './pages/Staff/Staff';
import CustomerFeedback from './pages/CustomerFeedback/CustomerFeedback';
import LoyaltyPoints from './pages/LoyaltyPoints/LoyaltyPoints';
import Reports from './pages/Reports/Reports';
import AuthForm from './components/Auth/AuthForm';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';  // নতুন - Admin Dashboard কম্পোনেন্ট

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const url = "http://localhost:4000";

  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/table" element={<Table />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/feedback" element={<CustomerFeedback />} />
          <Route path="/loyalty" element={<LoyaltyPoints />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/auth/:role" element={<AuthForm />} />
          <Route path="/admin" element={<AdminDashboard />} />   {/* নতুন রাউট */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
