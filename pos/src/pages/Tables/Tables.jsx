import React, { useEffect, useState } from 'react';
import './Tables.css';
import axios from 'axios';
import { url } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Tables = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  // টেবিলগুলা সার্ভার থেকে আনো
  const fetchTables = async () => {
    try {
      const response = await axios.get(`${url}/api/table/list`);
      if (response.data.success) {
        setTables(response.data.data);
      }
    } catch (error) {
      console.log("Error loading tables");
    }
  };

  // টেবিল সিলেক্ট করলে চেক করো status
  const selectTable = (tableId, status) => {
    if (status !== "Free") {
      alert("This table is not available. Please select a Free table.");
      return;
    }
    localStorage.setItem("selectedTable", tableId);
    navigate("/menu"); // অর্ডার নেওয়ার পেজে যাও
  };

  useEffect(() => {
    fetchTables();
  }, []);

  return (
    <div className="tables-page">
      <h2>Select a Table</h2>
      <div className="table-grid">
        {tables.map((table) => (
          <div
            key={table._id}
            className={`table-card ${table.status.toLowerCase()}`} // css class: free / reserved / occupied
            onClick={() => selectTable(table._id, table.status)}
          >
            <h3>Table {table.number}</h3>
            <p>Status: {table.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tables;
