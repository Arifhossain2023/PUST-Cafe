import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { url } from "../../assets/assets";  // ✅ Corrected path
import './ShiftNotice.css';

const ShiftNotice = () => {
  const [morning, setMorning] = useState([]);
  const [evening, setEvening] = useState([]);

  useEffect(() => {
    const fetchShiftData = async () => {
      try {
        const res = await axios.get(`${url}/api/staff/shift`);
        setMorning(res.data.morning || []);
        setEvening(res.data.evening || []);
      } catch (err) {
        console.error("Shift data error:", err);
      }
    };

    fetchShiftData();
  }, []);

  return (
    <div className="shift-notice">
      <div className="shift-column">
        <h4>Morning Shift</h4>
        <ul>
          {morning.length === 0 ? (
            <li>No staff in morning</li>
          ) : (
            morning.map((s) => (
              <li key={s._id}>{s.name} ({s.role})</li>
            ))
          )}
        </ul>
      </div>
      <div className="shift-column">
        <h4>Evening Shift</h4>
        <ul>
          {evening.length === 0 ? (
            <li>No staff in evening</li>
          ) : (
            evening.map((s) => (
              <li key={s._id}>{s.name} ({s.role})</li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ShiftNotice;
