import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../assets/assets';
import './Kitchen.css';

const KitchenOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/order/list`);
      if (res.data.success) {
        setOrders(res.data.data.reverse());
      }
    } catch (err) {
      console.error("POS Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // 10 sec auto refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pos-kitchen-orders">
      <h2>Kitchen Orders (POS View)</h2>
      {orders.length === 0 ? (
        <p>No orders in kitchen yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Items:</strong> {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span className={`status ${order.status.toLowerCase().replace(/\s/g, '-')}`}>
                  {order.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KitchenOrders;
