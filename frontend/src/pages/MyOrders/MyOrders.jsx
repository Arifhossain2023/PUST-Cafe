import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + '/api/order/userorders',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // সঠিক হেডার ফরম্যাট
          },
        }
      );
      setData(response.data.data);
    } catch (error) {
      console.error('Fetch orders error:', error);
      // প্রয়োজনমতো UI-তে এরর দেখানো যেতে পারে
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.parcel_icon} alt="" />
            <p>
              {order.items.map((item, i) => {
                return (
                  item.name +
                  ' x ' +
                  item.quantity +
                  (i === order.items.length - 1 ? '' : ', ')
                );
              })}
            </p>
            <p>${order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p>
              <span>&#x25cf;</span> <b>{order.status}</b>
            </p>
            <button>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
