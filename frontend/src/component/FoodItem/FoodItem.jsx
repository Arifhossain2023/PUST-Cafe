import React, { useContext } from 'react';
import './FoodItem.css';
import { StoreContext } from '../../context/StoreContext';
import { Link } from 'react-router-dom';

const FoodItem = ({ image, name, price, desc, id, available }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  const quantity = cartItems && cartItems[id] ? cartItems[id] : 0;

  return (
    <div className='food-item'>
      {/* Image Click = Go to Details */}
      <Link to={`/product/${id}`}>
        <div className='food-item-img-container'>
          <img className='food-item-image' src={`${url}/images/${image}`} alt={name} />
        </div>
      </Link>

      <div className="food-item-info">
        <div className="food-item-name-status">
          {/* Name Click = Go to Details */}
          <Link to={`/product/${id}`} className="food-item-name">
            {name}
          </Link>

          {/* Only show status, no click */}
          <span
            className={`food-item-status ${available ? 'available' : 'unavailable'}`}
            style={{ cursor: "default" }}
            title={`Status: ${available ? 'Available' : 'Unavailable'}`}
          >
            {available ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <p className="food-item-desc">{desc}</p>
        <p className="food-item-price">${price}</p>

        {/* Add / Remove to Cart */}
        {quantity === 0 ? (
          <button className='add-to-cart-btn' onClick={() => addToCart(id)}>
            Add to Cart
          </button>
        ) : (
          <div className="food-item-counter">
            <button onClick={() => removeFromCart(id)}>-</button>
            <p>{quantity}</p>
            <button onClick={() => addToCart(id)}>+</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItem;
