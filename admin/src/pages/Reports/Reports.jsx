import React, { useEffect, useState } from 'react';
import './Reports.css';
import axios from 'axios';
import { url } from '../../assets/assets';

const Reports = () => {
  const [salesDaily, setSalesDaily] = useState({ totalSales: 0, totalOrders: 0 });
  const [salesMonthly, setSalesMonthly] = useState({ totalSales: 0, totalOrders: 0 });
  const [topItems, setTopItems] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [itemsRes, dailyRes, monthlyRes] = await Promise.all([
        axios.get(`${url}/api/report/top-items`),
        axios.get(`${url}/api/report/daily-sales`),
        axios.get(`${url}/api/report/monthly-sales`)
      ]);

      if (itemsRes.data.success) setTopItems(itemsRes.data.data);
      if (dailyRes.data.success) setSalesDaily(dailyRes.data.data);
      if (monthlyRes.data.success) setSalesMonthly(monthlyRes.data.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  return (
    <div className="reports">
      {/* Top Selling Items */}
      <section className="report-section">
        <h2>Top Selling Items</h2>
        <table className="report-table">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity Sold</th>
            </tr>
          </thead>
          <tbody>
            {topItems.length === 0 ? (
              <tr><td colSpan="2">No data available</td></tr>
            ) : (
              topItems.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* Daily Sales Report */}
      <section className="report-section">
        <h2>Daily Sales Report</h2>
        <table className="report-table">
          <tbody>
            <tr>
              <td><strong>Total Sales:</strong></td>
              <td>৳{salesDaily.totalSales}</td>
            </tr>
            <tr>
              <td><strong>Total Orders:</strong></td>
              <td>{salesDaily.totalOrders}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Monthly Sales Report */}
      <section className="report-section">
        <h2>Monthly Sales Report</h2>
        <table className="report-table">
          <tbody>
            <tr>
              <td><strong>Total Sales:</strong></td>
              <td>৳{salesMonthly.totalSales}</td>
            </tr>
            <tr>
              <td><strong>Total Orders:</strong></td>
              <td>{salesMonthly.totalOrders}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Reports;
