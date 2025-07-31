import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ManualPayments.css';
import { url } from '../../assets/assets';

const ManualPayments = () => {
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${url}/api/payment/manual`);
      if (res.data.success) {
        setPayments(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching manual payments");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.patch(`${url}/api/payment/manual/${id}`, { status });
      if (res.data.success) {
        fetchPayments();
      }
    } catch (err) {
      console.error("Status update failed");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <div className="manual-payments-page">
      <h2>📄 Manual Payment Requests</h2>
      {payments.length === 0 ? (
        <p>No manual payments found.</p>
      ) : (
        <table className="manual-payment-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Method</th>
              <th>Mobile</th>
              <th>Txn ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td>{p.orderId?._id}</td>
                <td>{p.method}</td>
                <td>{p.phone}</td>
                <td>{p.txnId}</td>
                <td>{p.status}</td>
                <td>
                  {p.status === 'Pending' && (
                    <>
                      <button onClick={() => updateStatus(p._id, 'Approved')}>✅ Approve</button>
                      <button onClick={() => updateStatus(p._id, 'Rejected')}>❌ Reject</button>
                    </>
                  )}
                  {p.status !== 'Pending' && <span>--</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManualPayments;
