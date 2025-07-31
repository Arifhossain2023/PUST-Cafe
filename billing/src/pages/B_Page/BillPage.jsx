import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BillPage.css';
import { url, assets } from '../../assets/assets';
import { useReactToPrint } from 'react-to-print';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BillPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const componentRef = useRef();

  useEffect(() => {
    axios.get(`${url}/api/order/${orderId}`)
      .then(res => setOrder(res.data.data))
      .catch(err => console.error(err));
  }, [orderId]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const exportPDF = () => {
    const input = componentRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Bill-${order.billNo || order._id}.pdf`);
    });
  };

  if (!order) return <div>Loading...</div>;

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = order.discount || 0;
  const total = subtotal - discount;

  return (
    <div className="bill-container">
      <div className="bill-box" ref={componentRef}>
        <div className="bill-header">
          <div className="logo-section">
            <img src={assets.logo} alt="Logo" className="logo-img" />
            <div className="quote">"Eat well. Live well. Be well."</div>
          </div>
          <div className="cafeteria-info">
            <h2>Pabna University of Science and Technology</h2>
            <p><strong>Central Cafeteria</strong></p>
          </div>
        </div>

        <p><b>Bill No:</b> {order.billNo || 'N/A'}</p>
        <p><b>Order ID:</b> {order._id}</p>
        <p><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>
        <hr />
        <table className="bill-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, i) => (
              <tr key={i}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>৳{item.price}</td>
                <td>৳{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <hr />
        <div className="bill-totals">
          <p>Subtotal: ৳{subtotal.toFixed(2)}</p>
          <p>Discount: ৳{discount.toFixed(2)}</p>
          <h3>Total: ৳{total.toFixed(2)}</h3>
        </div>
      </div>

      <div className="bill-buttons">
        <button className="print-btn" onClick={handlePrint}>🖨️ Print Bill</button>
        <button className="print-btn" onClick={exportPDF}>📥 Download PDF</button>
      </div>
    </div>
  );
};

export default BillPage;
