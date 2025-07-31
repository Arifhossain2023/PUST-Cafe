import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../assets/assets";
import "./CustomerFeedback.css";

const CustomerFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`${url}/api/feedback/list`);
        if (res.data.success) setFeedbacks(res.data.data);
      } catch (err) {
        console.error("Failed to fetch feedbacks", err);
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="customer-feedback-admin">
      <h2>Customer Feedback</h2>

      {feedbacks.length === 0 ? (
        <p>No feedbacks found.</p>
      ) : (
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Feedback</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((fb, i) => (
              <tr key={i}>
                <td>{fb.userName || "N/A"}</td>
                <td>{fb.userEmail || "N/A"}</td>
                <td>{fb.rating}/5</td>
                <td>{fb.comment || "-"}</td>
                <td>{new Date(fb.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerFeedback;
