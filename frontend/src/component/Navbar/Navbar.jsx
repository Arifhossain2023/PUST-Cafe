import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets, url } from '../../assets/assets'; // ✅ use url from assets
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import ProfileModal from '../../component/ProfileModal/ProfileModal';
import LoginPopup from '../../component/LoginPopup/LoginPopup';

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const [searchText, setSearchText] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const {
    getTotalCartAmount,
    user,
    setUser,
    token,
    setToken,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchText)}`);
      setSearchText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
    setShowProfileModal(false);
    navigate("/"); // ✅ optional
  };

  return (
    <>
      <div className='navbar'>
        <Link to='/'><img className='logo' src={assets.logo} alt="Logo" /></Link>

        <ul className="navbar-menu">
          <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
          <Link to="/UserTables" onClick={() => setMenu("tables")} className={menu === "tables" ? "active" : ""}>Tables</Link>
          <Link to="/about" onClick={() => setMenu("about")} className={menu === "about" ? "active" : ""}>About</Link>
          <Link to="/my-orders" onClick={() => setMenu("my-orders")} className={menu === "my-orders" ? "active" : ""}>MyOrders</Link>
          <a href='#footer' onClick={() => setMenu("contact")} className={menu === "contact" ? "active" : ""}>Contact</a>
        </ul>

        <div className="navbar-right">
          <div className="search-box">
            <img
              src={assets.search_icon}
              alt="Search"
              onClick={handleSearch}
              style={{ cursor: "pointer" }}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <Link to='/cart' className='navbar-search-icon'>
            <img src={assets.basket_icon} alt="Cart" />
            {getTotalCartAmount() > 0 && <div className="dot"></div>}
          </Link>

          {!token ? (
            <button onClick={() => setShowLogin(true)}>Sign In</button>
          ) : (
            <img
              src={user?.image ? `${url}/images/${user.image}` : assets.profile_icon}
              alt="Profile"
              className='nav-profile-img'
              onClick={() => setShowProfileModal(true)}
              style={{ cursor: "pointer" }}
            />
          )}
        </div>
      </div>

      {showLogin && (
        <LoginPopup onClose={() => setShowLogin(false)} />
      )}

      {showProfileModal && user && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onLogout={handleLogout} // ✅ logout passed correctly
        />
      )}
    </>
  );
};

export default Navbar;
