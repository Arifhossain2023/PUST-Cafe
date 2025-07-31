import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from '../../assets/assets';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/order/list`);
      if (res.data.success) {
        setOrders(res.data.data.reverse());
      }
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000); // 15 seconds refresh
    return () => clearInterval(interval);
  }, []);

  const changeStatus = async (orderId, status) => {
    try {
      const res = await axios.post(`${url}/api/order/status`, { orderId, status });
      if (res.data.success) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  return (
    <div className="orders-page">
      <h2>Order Management</h2>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order._id} className="order-card">
              <div>
                <strong>Table:</strong>{" "}
                {order.tableId?.number || 'N/A'}
              </div>
              <div>
                <strong>Items:</strong>{" "}
                {order.items?.map(i => `${i.name} x${i.quantity}`).join(', ') || 'No items'}
              </div>
              <div><strong>Total:</strong> ${order.amount?.toFixed(2) || '0.00'}</div>
              <div>
                <strong>Status:</strong>
                <select
                  value={order.status}
                  onChange={(e) => changeStatus(order._id, e.target.value)}
                >
                  <option value="Food Processing">Food Processing</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
