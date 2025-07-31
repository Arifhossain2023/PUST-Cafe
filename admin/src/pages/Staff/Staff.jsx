import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from '../../assets/assets';
import "./Staff.css";

const Staff = () => {
  const [staffList, setStaffList] = useState([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${url}/api/staff`);
      setStaffList(res.data || []);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  const handleShiftChange = async (staffId, newShift) => {
    try {
      const res = await axios.put(`${url}/api/staff/${staffId}/shift`, {
        shift: newShift,
      });

      if (res.data.success) {
        const updatedList = staffList.map((staff) =>
          staff._id === staffId ? { ...staff, shift: newShift } : staff
        );
        setStaffList(updatedList);
      }
    } catch (err) {
      console.error("Error updating shift:", err);
    }
  };

  const morningShift = staffList.filter(staff => staff.shift === 'Morning');
  const eveningShift = staffList.filter(staff => staff.shift === 'Evening');

  return (
    <div className="staff-container">
      <h2>Registered Staff List</h2>
      {staffList.length === 0 ? (
        <p>No staff registered yet.</p>
      ) : (
        <table className="staff-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Shift</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff._id}>
                <td>
                  {staff.image ? (
                    <img
                      src={`${url}/images/${staff.image}`}
                      alt={staff.name}
                      className="staff-image"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td>{staff.name}</td>
                <td>{staff.email}</td>
                <td>{staff.phone}</td>
                <td>{staff.role}</td>
                <td>
                  <select
                    value={staff.shift || "None"}
                    onChange={(e) => handleShiftChange(staff._id, e.target.value)}
                  >
                    <option value="None">None</option>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="shift-box-container">
        <div className="shift-box">
          <h3>Morning Shift</h3>
          {morningShift.length === 0 ? (
            <p>No staff in Morning shift.</p>
          ) : (
            <ul>
              {morningShift.map((staff) => (
                <li key={staff._id}>
                  {staff.name} ({staff.role})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="shift-box">
          <h3>Evening Shift</h3>
          {eveningShift.length === 0 ? (
            <p>No staff in Evening shift.</p>
          ) : (
            <ul>
              {eveningShift.map((staff) => (
                <li key={staff._id}>
                  {staff.name} ({staff.role})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Staff;
