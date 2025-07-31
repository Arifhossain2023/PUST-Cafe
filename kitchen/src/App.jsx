import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Orders from './pages/Orders/Orders';
import AuthForm from './components/Auth/AuthForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './index.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="page-content">
        <Routes>
          <Route path="/" element={<Navigate to="/kitchen" replace />} />
          <Route path="/auth/:role" element={<AuthForm />} />
          <Route path="/login/:role" element={<AuthForm />} />
          <Route path="/kitchen" element={<Orders />} />
          <Route path="/orders" element={<Orders />} />  {/* এই লাইনটা যোগ করলাম */}
        </Routes>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop />
    </Router>
  );
};

export default App;
