// ✅ LoginPopup.jsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import './LoginPopup.css';

const LoginPopup = ({ onClose }) => {
  const { setToken, setUser } = useContext(StoreContext);

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    role: 'student',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'login' : 'register';

    try {
      let payload;
      let headers = {};

      if (isLogin) {
        payload = {
          email: formData.email,
          password: formData.password,
        };
      } else {
        payload = new FormData();
        payload.append('fullName', formData.fullName);
        payload.append('phone', formData.phone);
        payload.append('email', formData.email);
        payload.append('password', formData.password);
        payload.append('role', formData.role);
        if (formData.image) {
          payload.append('image', formData.image);
        }
        headers = { headers: { 'Content-Type': 'multipart/form-data' } };
      }

      const res = await axios.post(`http://localhost:4000/api/user/${endpoint}`, payload, headers);

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setToken(res.data.token);
        setUser(res.data.user);
        onClose();
      } else {
        alert(res.data.message || `${isLogin ? "Login" : "Register"} failed`);
      }

    } catch (error) {
      console.error("Auth error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-popup">
      <div className="login-form">
        <button className="close-btn" onClick={onClose}>✕</button>
        <form onSubmit={handleSubmit}>
          <h2>{isLogin ? "Login" : "Register"}</h2>

          {!isLogin && (
            <>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>
        <p className="switch" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Register" : "Already registered? Login"}
        </p>
      </div>
    </div>
  );
};

export default LoginPopup;
