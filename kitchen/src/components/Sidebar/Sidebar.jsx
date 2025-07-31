import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <NavLink to="/kitchen" className="sidebar-link">
        🍽️ Orders
      </NavLink>
    </div>
  );
};

export default Sidebar;