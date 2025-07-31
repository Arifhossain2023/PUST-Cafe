import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const PlaceOrder = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const [deliveryType, setDeliveryType] = useState("home-delivery");
  const [dineInTime, setDineInTime] = useState("");

  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (deliveryType === "dine-in" && !dineInTime) {
      toast.error("Please select dine-in time");
      return;
    }

    let orderItems = [];

    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item };
        itemInfo.quantity = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + (deliveryType === "home-delivery" ? 50 : 0),
      deliveryType,
      dineInTime: deliveryType === "dine-in" ? dineInTime : null,
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        toast.error("Order placement failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      toast.error("Please sign in and add items to cart");
      navigate('/cart');
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>

        {/* Delivery Type Selector */}
        <div className="delivery-type-options">
          <label>
            <input
              type="radio"
              value="home-delivery"
              checked={deliveryType === "home-delivery"}
              onChange={(e) => setDeliveryType(e.target.value)}
            />
            Home Delivery
          </label>
          <label>
            <input
              type="radio"
              value="dine-in"
              checked={deliveryType === "dine-in"}
              onChange={(e) => setDeliveryType(e.target.value)}
            />
            Dine-in
          </label>
        </div>

        {/* Dine-in Time Input */}
        {deliveryType === "dine-in" && (
          <div className="dine-in-time">
            <label htmlFor="dineInTime">Visit Time:</label>
            <input
              type="time"
              id="dineInTime"
              value={dineInTime}
              onChange={(e) => setDineInTime(e.target.value)}
              required={deliveryType === "dine-in"}
            />
          </div>
        )}

        {/* Address Fields */}
        <div className="multi-field">
          <input type="text" name='firstName' onChange={onChangeHandler} value={data.firstName} placeholder='First name' required />
          <input type="text" name='lastName' onChange={onChangeHandler} value={data.lastName} placeholder='Last name' required />
        </div>
        <input type="email" name='email' onChange={onChangeHandler} value={data.email} placeholder='Email address' required />
        <input type="text" name='street' onChange={onChangeHandler} value={data.street} placeholder='Street' required />
        <div className="multi-field">
          <input type="text" name='city' onChange={onChangeHandler} value={data.city} placeholder='City' required />
          <input type="text" name='state' onChange={onChangeHandler} value={data.state} placeholder='State' required />
        </div>
        <div className="multi-field">
          <input type="text" name='zipcode' onChange={onChangeHandler} value={data.zipcode} placeholder='Zip code' required />
          <input type="text" name='country' onChange={onChangeHandler} value={data.country} placeholder='Country' required />
        </div>
        <input type="text" name='phone' onChange={onChangeHandler} value={data.phone} placeholder='Phone' required />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${deliveryType === "home-delivery" && getTotalCartAmount() !== 0 ? 50 : 0}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${deliveryType === "home-delivery" && getTotalCartAmount() !== 0 ? getTotalCartAmount() + 50 : getTotalCartAmount()}</b>
            </div>
          </div>
        </div>
        <button className='place-order-submit' type='submit'>Proceed To Payment</button>
      </div>
    </form>
  );
};

export default PlaceOrder;