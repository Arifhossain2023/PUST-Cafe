import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Bills from './pages/B_s/Bills';
import BillPage from './pages/B_Page/BillPage';
import Navbar from './components/Navbar/Navbar';
import AuthForm from './components/Auth/AuthForm';
import MobilePayment from './pages/MobilePayment/MobilePayment';
import Sidebar from './components/Sidebar/Sidebar';
import ManualPayments from './pages/ManualPayments/ManualPayments';

import './App.css'; // CSS layout এর জন্য

function App() {
  return (
    <div className="main-layout">
      {/* Sidebar দেখাও সবসময় */}
      <Sidebar />

      <div className="main-content">
        <Navbar />
        <Routes>
          <Route path="/" element={<div>Welcome to Cashier Panel</div>} />
          <Route path="/billing" element={<Bills />} />
          <Route path="/bill/:orderId" element={<BillPage />} />
          <Route path="/mobile-payment/:orderId" element={<MobilePayment />} />
          <Route path="/manual-payments" element={<ManualPayments />} />
          <Route path="/auth/:role" element={<AuthForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
