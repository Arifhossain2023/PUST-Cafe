import React from 'react';
import './About.css';

// Image imports (if inside src/assets/images or similar)
import directorImage from './images/director.jpg';
import staff1Image from './images/staff1.jpg';
import staff2Image from './images/staff2.jpg';
import staff3Image from './images/staff3.jpg';

const About = () => {
  return (
    <div className="about">
      <h2>About PUST Cafeteria</h2>
      <p>
        The PUST Cafeteria is operated under the supervision of a Professor who ensures the overall management, cleanliness, and food quality. Our chefs (shap) work daily to serve healthy and affordable meals to students and staff.
      </p>

      {/* Cafeteria Director */}
      <div className="profile-section">
        <h3>Cafeteria In-Charge</h3>
        <div className="profile-card">
          <img src={directorImage} alt="Director" />
          <div>
            <h4>Dr. Md. Ekramul Islam</h4>
            <p>Associate Professor, Department of Mathematics</p>
            <p>Director of PUST Cafeteria</p>
            <p>Contact: +8801718577226 (Personal)</p>
          </div>
        </div>
      </div>

      {/* Staff Members */}
      <div className="profile-section">
        <h3>Our Chefs & Staff</h3>
        <div className="staff-grid">
          <div className="profile-card">
            <img src={staff1Image} alt="Chef 1" />
            <div>
              <h4>Md.....</h4>
              <p>Head Chef</p>
              <p>Expert in Deshi Cuisine</p>
            </div>
          </div>

          <div className="profile-card">
            <img src={staff2Image} alt="Chef 2" />
            <div>
              <h4>Md....</h4>
              <p>Assistant Chef</p>
              <p>Specialist in Snacks & Beverages</p>
            </div>
          </div>

          <div className="profile-card">
            <img src={staff3Image} alt="Chef 3" />
            <div>
              <h4>Miss.....</h4>
              <p>Kitchen Helper</p>
              <p>Maintains Hygiene & Cleanliness</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
