import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/billing" className="sidebar-option">
          <p>Bills</p>
        </NavLink>
        <NavLink to="/manual-payments" className="sidebar-option">
          <p>Manual Payments</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
