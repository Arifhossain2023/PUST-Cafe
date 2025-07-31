import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        {/* Left Section */}
        <div className="footer-content-left">
          <img src={assets.logo} alt="Footer Logo" className="footer-logo" />
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos,
            nesciunt magni? Dolore, voluptatum aliquid? Sapiente, autem
            expedita aspernatur incidunt est, temporibus laboriosam libero
            error repellat quam odit, ipsa dolorem ducimus?
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="Facebook" />
          </div>
        </div>

        {/* Center Section */}
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>017xxxxxxx</li>
            <li>cafe@email.com</li>
          </ul>
        </div>
      </div>

      <hr />
      <p className="footer-copyright">
        © {new Date().getFullYear()} All Rights Reserved (Arif)
      </p>
    </div>
  );
};

export default Footer;
