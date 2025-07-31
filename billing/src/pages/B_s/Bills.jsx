import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Bills.css';
import { toast } from 'react-toastify';
import { url } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';

const Bills = () => {
  const [unpaidOrders, setUnpaidOrders] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/order/list/all`);
      if (res.data.success) {
        const allOrders = res.data.data;
        const unpaid = allOrders.filter(order => !order.payment);
        const paid = allOrders.filter(order => order.payment);

        setUnpaidOrders(unpaid);
        setPaidOrders(paid);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (err) {
      toast.error("Error fetching orders");
    }
  };

  const markPaid = async (orderId) => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("User not logged in");
        return;
      }
      const user = JSON.parse(storedUser);
      const token = user.token;

      const res = await axios.post(
        `${url}/api/order/status`,
        { orderId, status: "Paid" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Marked as paid");
        fetchOrders();
      }
    } catch (err) {
      toast.error("Error marking paid");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrderCard = (order, showPayButton = false) => (
    <div key={order._id} className="bill-card">
      <p><b>Bill No:</b> {order.billNo || 'N/A'}</p>
      <p><b>Order ID:</b> {order._id}</p>
      <p><b>Items:</b> {order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}</p>
      <p><b>Total:</b> ৳{order.amount}</p>
      <p><b>Status:</b> {order.payment ? "✅ Paid" : "❌ Unpaid"}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {showPayButton && (
          <>
            <button onClick={() => markPaid(order._id)}>Mark as Paid</button>
            <button onClick={() => navigate(`/mobile-payment/${order._id}`)}>Mobile Payment</button>
          </>
        )}
        <Link to={`/bill/${order._id}`}>
          <button>View Bill</button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="billing-page">
      <div className="bill-section unpaid">
        <h2>❌ Unpaid Bills</h2>
        {unpaidOrders.length === 0 ? (
          <p>No unpaid orders.</p>
        ) : (
          unpaidOrders.map(order => renderOrderCard(order, true))
        )}
      </div>

      <div className="bill-section paid">
        <h2>✅ Paid Bills</h2>
        {paidOrders.length === 0 ? (
          <p>No paid orders.</p>
        ) : (
          paidOrders.map(order => renderOrderCard(order))
        )}
      </div>
    </div>
  );
};

export default Bills;
