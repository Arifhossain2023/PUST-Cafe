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
      navigate("/auth/kitchen");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setShowProfile(false);
    navigate("/auth/kitchen");
  };

  const handleLogoClick = () => {
    navigate('/billing');
  };

  return (
    <>
      <div className="navbar">
        <img
          className="logo"
          src={assets.logo}
          alt="logo"
          style={{ cursor: 'pointer' }}
          onClick={handleLogoClick}
        />
        <h3>Kitchen Panel</h3>

        <div className="profile-section">
          <img
            className="profile"
            src={user?.image ? `${url}/images/${user.image}` : assets.profile_image}
            alt="profile"
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          />

          {showProfile && user && (
            <ProfileBox
              name={user.name}
              role={user.role}
              image={user?.image ? `${url}/images/${user.image}` : assets.profile_image}
              onLogout={handleLogout}
              onClose={() => setShowProfile(false)}
            />
          )}
        </div>
      </div>

      {/* ✅ Shift Notice Box: Navbar এর নিচে */}
      <ShiftNotice />
    </>
  );
};

export default Navbar;
