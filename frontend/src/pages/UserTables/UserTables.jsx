import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../assets/assets";
import { toast } from "react-toastify";
import "./UserTables.css";

const UserTables = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [userType, setUserType] = useState("student");
  const [lastNotifiedStatus, setLastNotifiedStatus] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    roll: "",
    phone: "",
    orgName: "",
    contactName: "",
    contactPhone: "",
    address: ""
  });

  const getToken = () => localStorage.getItem("token");

  const clearForm = () => {
    setFormData({
      name: "",
      department: "",
      roll: "",
      phone: "",
      orgName: "",
      contactName: "",
      contactPhone: "",
      address: ""
    });
  };

  const fetchTables = async () => {
    try {
      const res = await axios.get(`${url}/api/table/list`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (res.data.success) {
        const userId = localStorage.getItem("userId");
        const reservedTable = res.data.data.find(table =>
          table.reservation &&
          table.reservation.userId === userId &&
          table.reservation.status !== "pending"
        );

        if (reservedTable && reservedTable.reservation.status !== lastNotifiedStatus) {
          if (reservedTable.reservation.status === "accepted") {
            toast.success("✅ Your reservation is accepted!");
          } else if (reservedTable.reservation.status === "rejected") {
            toast.error("❌ Your reservation was rejected.");
          }
          setLastNotifiedStatus(reservedTable.reservation.status);
        }

        setTables(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch tables");
    }
  };

  const openForm = (tableId) => {
    setSelectedTable(tableId);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitReservation = async () => {
    const token = getToken();
    if (!token) {
      toast.error("User not authenticated");
      return;
    }

    let userInfo = {};
    const {
      name,
      department,
      roll,
      phone,
      orgName,
      contactName,
      contactPhone,
      address
    } = formData;

    if (userType === "student") {
      if (!name || !department || !roll || !phone)
        return toast.error("All student fields are required");
      userInfo = { userType, name, department, roll, phone };
    } else if (userType === "organization") {
      if (!orgName || !contactName || !contactPhone || !address)
        return toast.error("All organization fields are required");
      userInfo = { userType, orgName, contactName, contactPhone, address };
    } else if (userType === "teacher") {
      if (!name || !department || !phone)
        return toast.error("All teacher fields are required");
      userInfo = { userType, name, department, phone };
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${url}/api/reservation/send`,
        {
          tableId: selectedTable,
          userInfo: userInfo,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        toast.success("Reservation request sent");
        setShowForm(false);
        clearForm();
        fetchTables();
      } else {
        toast.error(res.data.message || "Request failed");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables(); // initial load
    const interval = setInterval(fetchTables, 5000); // polling every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="tables-page">
      <h2>Request Table Reservation</h2>

      <div className="table-grid">
        {tables.map((table) => (
          <div
            key={table._id}
            className={`table-card ${table.status.toLowerCase()}`}
          >
            <h3>Table {table.number}</h3>
            <p>Status: {table.status}</p>
            {table.status === "Free" ? (
              <button disabled={loading} onClick={() => openForm(table._id)}>
                Request Reservation
              </button>
            ) : (
              <button disabled>Not Available</button>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="reservation-form-modal">
          <div className="form-container">
            <h3>Reservation Info</h3>

            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <option value="student">Student</option>
              <option value="organization">Organization</option>
              <option value="teacher">Teacher</option>
            </select>

            {userType === "student" && (
              <>
                <input
                  type="text"
                  placeholder="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Roll Number"
                  name="roll"
                  value={formData.roll}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </>
            )}

            {userType === "organization" && (
              <>
                <input
                  type="text"
                  placeholder="Organization Name"
                  name="orgName"
                  value={formData.orgName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Contact Person Name"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Contact Phone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                />
                <textarea
                  placeholder="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                ></textarea>
              </>
            )}

            {userType === "teacher" && (
              <>
                <input
                  type="text"
                  placeholder="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </>
            )}

            <div className="form-actions">
              <button onClick={submitReservation} disabled={loading}>
                Submit Request
              </button>
              <button onClick={() => setShowForm(false)} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTables;
