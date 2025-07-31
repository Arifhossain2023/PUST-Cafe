import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./AuthForm.css";
import { url } from "../../assets/assets";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    image: null,
  });
  const navigate = useNavigate();
  const { role } = useParams();

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "login" : "register";

    try {
      let payload;
      if (isLogin) {
        payload = { email: formData.email, password: formData.password };
      } else {
        // For register, use FormData for file upload
        payload = new FormData();
        payload.append("name", formData.name);
        payload.append("email", formData.email);
        payload.append("phone", formData.phone);
        payload.append("password", formData.password);
        payload.append("role", role);
        if (formData.image) {
          payload.append("image", formData.image);
        }
      }

      const headers = isLogin
        ? {}
        : { headers: { "Content-Type": "multipart/form-data" } };

      const res = await axios.post(`${url}/api/auth/${endpoint}`, payload, headers);

      if (res.data.success) {
        const userData = { ...res.data.user, token: res.data.token };
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", res.data.token); // 🔥 This line is missing



        // Redirect based on role
        if (role === "admin") navigate("/admin/dashboard");
        else if (role === "waiter") navigate("/menu");
        else if (role === "kitchen") navigate("/orders");
        else if (role === "cashier") navigate("/bills");
      } else {
        alert(res.data.message || "Login failed");
      }
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Register"} as {role}</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
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
      <p onClick={() => setIsLogin(!isLogin)} className="switch-mode" style={{ cursor: "pointer" }}>
        {isLogin ? "Don't have an account? Register" : "Already registered? Login"}
      </p>
    </div>
  );
};

export default AuthForm;
