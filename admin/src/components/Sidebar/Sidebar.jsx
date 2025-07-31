// src/components/Sidebar/Sidebar.jsx

import React from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/add" className="sidebar-option">
          <img src={assets.add_icon} alt="Add" className="icon add-icon" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <img src={assets.order_icon} alt="List" className="icon order-icon" />
          <p>List Items</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <img src={assets.order_icon} alt="Orders" className="icon order-icon" />
          <p>Orders</p>
        </NavLink>
        <NavLink to="/staff" className="sidebar-option">
          <img src={assets.staff_icon || assets.user_icon} alt="Staff" className="icon staff-icon" />
          <p>Staff Management</p>
        </NavLink>
        <NavLink to="/inventory" className="sidebar-option">
          <img src={assets.inventory_icon || assets.stock_icon} alt="Inventory" className="icon inventory-icon" />
          <p>Inventory & Stock</p>
        </NavLink>
        <NavLink to="/feedback" className="sidebar-option">
          <img src={assets.feedback_icon || assets.star_icon} alt="Feedback" className="icon feedback-icon" />
          <p>Customer Feedback</p>
        </NavLink>
        <NavLink to="/loyalty" className="sidebar-option">
          <img src={assets.loyalty_icon || assets.reward_icon} alt="Loyalty" className="icon loyalty-icon" />
          <p>Loyalty Points</p>
        </NavLink>
        <NavLink to="/reports" className="sidebar-option">
          <img src={assets.report_icon} alt="Reports" className="icon report-icon" />
          <p>Reports</p>
        </NavLink>
        <NavLink to="/table" className="sidebar-option">
          <img src={assets.table_icon} alt="Table" className="icon table-icon" />
          <p>Table Management</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
