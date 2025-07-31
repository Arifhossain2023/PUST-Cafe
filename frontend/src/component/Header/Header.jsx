import React from 'react';
import './Header.css';

const Header = () => {
  const scrollToMenu = () => {
    const menuSection = document.getElementById('explore-menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Order Your Favorite Food in One Click!</h2>
        <p>
          Delicious, healthy, and quick delivery. Explore our menu to find your next meal.
        </p>
        <button onClick={scrollToMenu}>View Menu</button>
      </div>
    </div>
  );
};

export default Header;
