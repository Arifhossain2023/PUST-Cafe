import React, { useEffect, useState } from 'react';
import './Orders.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { assets, url } from '../../assets/assets';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try {
      const user = JSON.parse(storedUser);
      return user.token || null;
    } catch {
      return null;
    }
  };

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data.reverse());
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    const token = getToken();
    if (!token) {
      toast.error("Please login to update order status");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/order/status`,
        {
          orderId,
          status: event.target.value
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        toast.success(`Order status updated to ${event.target.value}`);
        await fetchAllOrders();
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating order status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Food Processing': return 'orange';
      case 'Out for delivery': return 'blue';
      case 'Delivered': return 'green';
      default: return 'gray';
    }
  };

  return (
    <div className="order-page">
      <header className="order-page-header">
        <h1>Order Management</h1>
        <p>View and manage customer orders</p>
      </header>

      <div className="order-content">
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <img src={assets.empty_orders} alt="No orders" />
            <h3>No Orders Found</h3>
            <p>When you receive orders, they'll appear here</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order, index) => {
              const address = order.address || {};
              const orderDate = new Date(order.createdAt).toLocaleString();

              return (
                <div key={order._id} className="order-card">
                  <div className="order-card-header">
                    <div className="order-number">Order #{index + 1}</div>
                    <div 
                      className="order-status" 
                      style={{ backgroundColor: getStatusColor(order.status) }}
                    >
                      {order.status}
                    </div>
                  </div>

                  <div className="order-card-body">
                    <div className="order-info-section">
                      <h4>Customer Information</h4>
                      <p>
                        <strong>Name:</strong> {address.firstName || 'N/A'} {address.lastName || ''}
                      </p>
                      <p>
                        <strong>Phone:</strong> {address.phone || 'N/A'}
                      </p>
                      <p>
                        <strong>Date:</strong> {orderDate}
                      </p>
                      {/* নতুন: ডেলিভারি টাইপ */}
                      <p>
                        <strong>Delivery Type:</strong> {order.deliveryType === 'home-delivery' ? "Home Delivery" : "Dine-In"}
                      </p>
                      {/* যদি dine-in হয়, তবে সময় দেখানো */}
                      {order.deliveryType === 'dine-in' && order.dineInTime && (
                        <p>
                          <strong>Dine-In Time:</strong> {order.dineInTime}
                        </p>
                      )}
                    </div>

                    <div className="order-info-section">
                      <h4>Delivery Address</h4>
                      <p>{address.street || 'Street not provided'}</p>
                      <p>
                        {address.city || 'City not provided'}, {address.state || 'State not provided'}
                      </p>
                      <p>
                        {address.country || 'Country not provided'}, {address.zipcode || ''}
                      </p>
                    </div>

                    <div className="order-info-section">
                      <h4>Order Items ({order.items.length})</h4>
                      <ul className="order-items-list">
                        {order.items.map((item, i) => (
                          <li key={i}>
                            {item.name} × {item.quantity} = ৳{item.price * item.quantity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="order-card-footer">
                    <div className="order-total">
                      <span>Total Amount:</span>
                      <span className="amount">৳{order.amount}</span>
                    </div>

                    <select
                      className="status-select"
                      onChange={(e) => statusHandler(e, order._id)}
                      value={order.status}
                    >
                      <option value="Food Processing">Processing</option>
                      <option value="Out for delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
