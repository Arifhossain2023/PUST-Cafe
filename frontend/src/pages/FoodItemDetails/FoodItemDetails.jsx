import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { url } from '../../assets/assets';
import axios from 'axios';
import './FoodItemDetails.css';

const FoodItemDetails = () => {
  const { id } = useParams();
  const { food_list, user } = useContext(StoreContext);
  const item = food_list.find(item => item._id === id);

  const [form, setForm] = useState({
    rating: 5,
    comment: '',
  });

  const [success, setSuccess] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

  // ফিডব্যাক লিস্ট ফেচ
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${url}/api/feedback/list/${id}`);
      if (res.data.success) {
        setFeedbacks(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch feedbacks", err);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'rating' ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = user?._id || user?.id; // _id না থাকলে id নেবে
    console.log('User ID used for feedback:', userId);

    if (!user || !userId) {
      alert("Please login to submit feedback");
      return;
    }

    try {
      const payload = {
        userId,
        foodId: id,
        rating: form.rating,
        comment: form.comment,
      };

      const res = await axios.post(`${url}/api/feedback/add`, payload);

      if (res.data.success) {
        setSuccess(true);
        setForm({ rating: 5, comment: '' });
        fetchFeedbacks();  // সাবমিটের পরে ফিডব্যাক রিফ্রেশ করবো
      }
    } catch (err) {
      alert('Feedback submission failed.');
      console.error("Feedback submit error:", err.response || err);
    }
  };

  if (!item) return <p>Product not found</p>;

  return (
    <div className="food-detail-page">
      <img className="food-detail-img" src={`${url}/images/${item.image}`} alt={item.name} />

      <div className="food-detail-content">
        <div className="food-detail-header">
          <p className="food-name">{item.name}</p>
          <p className={`food-status ${item.available ? "available" : "unavailable"}`}>
            {item.available ? "Available" : "Unavailable"}
          </p>
          <p className="food-price">${item.price}</p>
        </div>

        <p className="food-detail-desc">{item.description}</p>

        <div className="food-feedback-section">
          <h3>Leave Your Feedback</h3>
          <form onSubmit={handleSubmit}>
            <select name="rating" value={form.rating} onChange={handleChange}>
              <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
              <option value={4}>⭐⭐⭐⭐ (4)</option>
              <option value={3}>⭐⭐⭐ (3)</option>
              <option value={2}>⭐⭐ (2)</option>
              <option value={1}>⭐ (1)</option>
            </select>
            <textarea
              name="comment"
              placeholder="Your feedback..."
              required
              value={form.comment}
              onChange={handleChange}
            ></textarea>
            <button type="submit">Submit Feedback</button>
          </form>
          {success && <p className="success-msg">Thanks for your feedback!</p>}
        </div>

        <div className="existing-feedbacks">
          <h3>Previous Feedbacks</h3>
          {loadingFeedbacks ? (
            <p>Loading feedbacks...</p>
          ) : feedbacks.length === 0 ? (
            <p>No feedback yet.</p>
          ) : (
            feedbacks.map((fb) => (
              <div key={fb._id} className="feedback-item">
                <p><strong>Rating:</strong> {fb.rating} ⭐</p>
                <p>{fb.comment}</p>
                <p className="feedback-user">By: {fb.userName || "Anonymous"}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodItemDetails;
