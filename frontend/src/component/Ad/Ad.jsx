import React from 'react';
import './Ad.css';
import advertisemen_1tImage from './images/advertisement_1.jpg';
import advertisemen_2tImage from './images/advertisement_2.jpg';
import advertisemen_3tImage from './images/advertisement_3.jpg';
import advertisemen_4tImage from './images/advertisement_4.jpg';
import advertisemen_5tImage from './images/advertisement_5.jpg';

const adData = [
  {
    image: advertisemen_1tImage,
    text: '',
    link: '#',
  },
  {
    image: advertisemen_2tImage,
    text: '',
    link: '#',
  },
  {
    image: advertisemen_3tImage,
    text: '',
    link: '#',
  },
  {
    image: advertisemen_4tImage,
    text: '!',
    link: '#',
  },
  {
    image: advertisemen_5tImage,
    text: '',
    link: '#',
  },
];

const Ad = () => {
  return (
    <div className="ad" id="ad">
      <div className="ad-slider">
        {adData.concat(adData).map((item, index) => (
          <a
            href={item.link}
            className="ad-item"
            key={index}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={item.image} alt={`Ad ${index + 1}`} />
            <p>{item.text}</p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Ad;
