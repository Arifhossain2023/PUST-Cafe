import React, { useEffect, useState } from "react";
import "./Table.css";
import axios from "axios";
import { url } from "../../assets/assets";
import { toast } from "react-toastify";

const Table = () => {
  const [tables, setTables] = useState([]);
  const [tableStats, setTableStats] = useState({});
  const [selectedReservation, setSelectedReservation] = useState(null);

  const fetchTables = async () => {
    try {
      const res = await axios.get(`${url}/api/table/list`);
      if (res.data.success) {
        setTables(res.data.data);
      } else {
        toast.error("Failed to load tables");
      }
    } catch (error) {
      toast.error("Server Error");
    }
  };

  const fetchTableStats = async () => {
    try {
      const res = await axios.get(`${url}/api/table/stats`);
      if (res.data.success) {
        setTableStats(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch table stats");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await axios.put(`${url}/api/table/update/${id}`, { status });
      if (res.data.success) {
        toast.success("Table updated");
        fetchTables();
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error("Error updating table");
    }
  };

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token;
  };

  const handleAccept = async (tableId, reservationId) => {
    const token = getToken();
    try {
      const res = await axios.put(
        `${url}/api/reservation/approve/${reservationId}`,
        { tableId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        toast.success("Reservation accepted");
        setSelectedReservation(null);
        fetchTables();
      } else {
        toast.error(res.data.message || "Failed to accept reservation");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  const handleReject = async (reservationId) => {
    const token = getToken();
    try {
      const res = await axios.put(
        `${url}/api/reservation/reject/${reservationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        toast.info("Reservation rejected");
        setSelectedReservation(null);
        fetchTables();
      } else {
        toast.error(res.data.message || "Failed to reject reservation");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    fetchTables();
    fetchTableStats();
  }, []);

  return (
    <div className="table-page">
      <header className="table-header">
        <h1>Table Report</h1>
      </header>

      <section className="table-grid">
        {tables.map((table) => {
          const stats = tableStats[table.number] || {
            totalOrders: 0,
            totalIdleTime: 0,
          };
          const hasReservation = table.reservationRequest;

          return (
            <div
              key={table._id}
              className={`table-card ${table.status.toLowerCase()}`}
            >
              <h3>Table {table.number}</h3>

              {hasReservation && (
                <button
                  className="reservation-btn"
                  onClick={() =>
                    setSelectedReservation({
                      tableId: table._id,
                      reservation: table.reservationRequest,
                    })
                  }
                >
                  Reservation Requested
                </button>
              )}

              <p>
                Status: <b>{table.status}</b>
              </p>
              <p>
                Total Orders: <b>{stats.totalOrders}</b>
              </p>
              <p>
                Idle Time: <b>{stats.totalIdleTime} min</b>
              </p>

              <select
                value={table.status}
                onChange={(e) => handleStatusChange(table._id, e.target.value)}
              >
                <option value="Free">Free</option>
                <option value="Occupied">Occupied</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>
          );
        })}
      </section>

      {/* Reservation Details Modal */}
      {selectedReservation && (
        <div className="reservation-modal">
          <div className="modal-content">
            <h3>Reservation Details</h3>
            <p>
              <b>User Type:</b> {selectedReservation.reservation.userInfo.userType}
            </p>

            {/* Student Info */}
            {selectedReservation.reservation.userInfo.userType === "student" && (
              <>
                <p>
                  <b>Name:</b> {selectedReservation.reservation.userInfo.name}
                </p>
                <p>
                  <b>Department:</b>{" "}
                  {selectedReservation.reservation.userInfo.department}
                </p>
                <p>
                  <b>Roll:</b> {selectedReservation.reservation.userInfo.roll}
                </p>
                <p>
                  <b>Phone:</b> {selectedReservation.reservation.userInfo.phone}
                </p>
              </>
            )}

            {/* Organization Info */}
            {selectedReservation.reservation.userInfo.userType === "organization" && (
              <>
                <p>
                  <b>Organization Name:</b>{" "}
                  {selectedReservation.reservation.userInfo.orgName}
                </p>
                <p>
                  <b>Contact Person:</b>{" "}
                  {selectedReservation.reservation.userInfo.contactName}
                </p>
                <p>
                  <b>Phone:</b>{" "}
                  {selectedReservation.reservation.userInfo.contactPhone}
                </p>
                <p>
                  <b>Address:</b> {selectedReservation.reservation.userInfo.address}
                </p>
              </>
            )}

            {/* Teacher Info */}
            {selectedReservation.reservation.userInfo.userType === "teacher" && (
              <>
                <p>
                  <b>Name:</b> {selectedReservation.reservation.userInfo.name}
                </p>
                <p>
                  <b>Department:</b>{" "}
                  {selectedReservation.reservation.userInfo.department}
                </p>
                <p>
                  <b>Phone:</b> {selectedReservation.reservation.userInfo.phone}
                </p>
              </>
            )}

            <div className="modal-buttons">
              <button
                className="accept-btn"
                onClick={() =>
                  handleAccept(selectedReservation.tableId, selectedReservation.reservation._id)
                }
              >
                Accept
              </button>
              <button
                className="reject-btn"
                onClick={() =>
                  handleReject(selectedReservation.reservation._id)
                }
              >
                Reject
              </button>
              <button
                className="close-btn"
                onClick={() => setSelectedReservation(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
