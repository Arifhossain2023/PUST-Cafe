import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import './MobilePayment.css';
import { url } from '../../assets/assets'; // backend base url

const paymentNumbers = {
  bkash: '017XXXXXXXX',
  nagad: '018XXXXXXXX',
  rocket: '019XXXXXXXX'
};

const MobilePayment = () => {
  const { orderId } = useParams();
  const [method, setMethod] = useState('bkash');
  const [txnId, setTxnId] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async () => {
    if (!txnId || !phone) {
      alert("Please enter Transaction ID and Mobile Number");
      return;
    }

    try {
      const res = await fetch(`${url}/api/payment/manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderId,
          method,
          phone,
          txnId
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Payment submitted successfully!");
        setTxnId('');
        setPhone('');
      } else {
        alert("❌ Submission failed: " + data.message);
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ Error submitting payment");
    }
  };

  return (
    <div className="payment-container">
      <h2>Mobile Payment for Order: {orderId}</h2>

      {/* 🔹 Method Selection */}
      <div className="method-selector">
        <button onClick={() => setMethod('bkash')} className={method === 'bkash' ? 'active' : ''}>bKash</button>
        <button onClick={() => setMethod('nagad')} className={method === 'nagad' ? 'active' : ''}>Nagad</button>
        <button onClick={() => setMethod('rocket')} className={method === 'rocket' ? 'active' : ''}>Rocket</button>
      </div>

      {/* 🔹 Manual Entry Form */}
      <div className="manual-payment">
        <h3>Manual Payment</h3>
        <p><b>Send payment to:</b> {paymentNumbers[method]}</p>
        <input
          type="text"
          placeholder="Your Mobile Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Transaction ID"
          value={txnId}
          onChange={(e) => setTxnId(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit Payment</button>
      </div>

      {/* 🔹 QR Code Payment */}
      <div className="qr-section">
        <h3>Scan QR to Pay via {method.toUpperCase()}</h3>
        <QRCode value={paymentNumbers[method]} size={200} />
        <p>Use your {method} app to scan and pay</p>
      </div>
    </div>
  );
};

export default MobilePayment;
