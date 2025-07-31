import React, { useState } from 'react';
import './Navbar.css';
import { assets, url } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import ProfileBox from '../ProfileBox/ProfileBox';
import ShiftNotice from '../ShiftNotice/ShiftNotice';

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleProfileClick = () => {
    if (user) {
      setShowProfile(!showProfile);
    } else {
      navigate("/auth/waiter"); // Not logged in → login page
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setShowProfile(false);
    navigate("/auth/waiter");
  };

  const profileImageSrc = user?.image
    ? `${url}/images/${user.image}`
    : assets.profile_image;

  return (
    <>
      <div className="navbar">
        <img className="logo" src={assets.logo} alt="logo" />
        <h3>POS - Waiter Panel</h3>

        <div className="profile-section">
          <img
            className="profile"
            src={profileImageSrc}
            alt="profile"
            onClick={handleProfileClick}
            style={{ cursor: "pointer" }}
          />

          {user && showProfile && (
            <ProfileBox
              name={user.name}
              role={user.role}
              image={profileImageSrc}
              onLogout={handleLogout}
              onClose={() => setShowProfile(false)}
            />
          )}
        </div>
      </div>

      {/* Shift Notice: Navbar এর নিচে দেখানো হবে */}
      <ShiftNotice />
    </>
  );
};

export default Navbar;
