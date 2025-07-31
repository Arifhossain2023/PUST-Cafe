import React, { useEffect, useState } from 'react';
import './LoyaltyPoints.css';
import axios from 'axios';
import { url } from '../../assets/assets';

const LoyaltyPoints = () => {
  const [pointsList, setPointsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPoints = async () => {
    try {
      const response = await axios.get(`${url}/api/loyalty/list`);
      if (response.data.success) {
        setPointsList(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch loyalty points", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, []);

  return (
    <div className="loyalty-points">
      <h3>Customer Loyalty Points</h3>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Failed to load data.</p>
      ) : (
        <table className="points-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Points</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {pointsList.map((item, index) => (
              <tr key={index}>
                <td>{item.userName || 'N/A'}</td>
                <td>{item.userEmail}</td>
                <td>{item.points}</td>
                <td>{new Date(item.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoyaltyPoints;
