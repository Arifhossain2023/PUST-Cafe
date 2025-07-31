import React from "react";
import "./ProfileBox.css";

const ProfileBox = ({ name, role, image, onLogout, onClose }) => {
  return (
    <div className="profile-box">
      <div className="profile-header">
        <span className="close-btn" onClick={onClose}>×</span>
      </div>
      <img src={image} alt="profile" className="profile-image" />
      <h3>{name}</h3>
      <p>{role}</p>
      <button className="logout-btn" onClick={onLogout}>Logout</button>
    </div>
  );
};

export default ProfileBox;
