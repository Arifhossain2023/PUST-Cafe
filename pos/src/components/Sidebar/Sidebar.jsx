// ✅ Sidebar.jsx
import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/cart" className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <img src={assets.add_icon} alt="Cart" className="icon" />
          <p>Cart</p>
        </NavLink>

        <NavLink to="/kitchen" className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <img src={assets.order_icon} alt="Kitchen" className="icon" />
          <p>Kitchen</p>
        </NavLink>

        <NavLink to="/orders" className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <img src={assets.order_icon} alt="Orders" className="icon" />
          <p>Orders</p>
        </NavLink>

        <NavLink to="/menu" className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <img src={assets.staff_icon || assets.user_icon} alt="Menu" className="icon" />
          <p>Menu</p>
        </NavLink>

        <NavLink to="/tables" className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <img src={assets.table_icon} alt="Tables" className="icon" />
          <p>Table</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;