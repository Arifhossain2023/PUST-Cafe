import React from 'react';
import './ProfileModal.css';
import { url } from '../../assets/assets'; // ✅ Use shared URL

const ProfileModal = ({ user, onClose, onLogout }) => {
  return (
    <div className="profile-modal">
      <div className="profile-box">
        <button className="close-btn" onClick={onClose}>✕</button>

        <img
          src={user?.image ? `${url}/images/${user.image}` : "/default.jpg"}
          alt="Profile"
          className="profile-image"  // ✅ Correct class name
        />
        <h3>{user.fullName}</h3>
        <p>{user.email}</p>
        <p>{user.phone}</p>
        <p>{user.role}</p>

        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
};

export default ProfileModal;
