import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import "./List.css";

const socket = io("http://localhost:4000");

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const fetchList = async () => {
    console.log("📡 Fetching list from", `${url}/api/food/list`);
    try {
      const { data } = await axios.get(`${url}/api/food/list`);
      if (data.success) {
        setList(data.data);
      } else {
        toast.error("Failed to fetch food list");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    setLoadingId(id);
    try {
      const { data } = await axios.post(`${url}/api/food/toggleAvailability`, {
        id,
        available: !currentStatus,
      });
      if (data.success) {
        toast.success(data.message);
        setList((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, available: !currentStatus } : item
          )
        );
      } else {
        toast.error("Failed to update availability");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setLoadingId(null);
    }
  };

  // ✅ Remove food item
  const handleRemove = async (id) => {
    const confirm = window.confirm("Are you sure you want to remove this item?");
    if (!confirm) return;

    try {
      const { data } = await axios.post(`${url}/api/food/remove`, { id });
      if (data.success) {
        toast.success("Food item removed");
        setList(prev => prev.filter(item => item._id !== id));
      } else {
        toast.error("Failed to remove food item");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    fetchList();

    socket.on("foodAvailabilityUpdated", ({ id, available }) => {
      setList((prev) =>
        prev.map((item) => (item._id === id ? { ...item, available } : item))
      );
    });

    return () => {
      socket.off("foodAvailabilityUpdated");
    };
  }, [url]);

  return (
    <div className="list add flex-col">
      <h2>Manage Food Items</h2>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Status</b>
          <b>Action</b>
        </div>

        {list.length === 0 ? (
          <p>No food items available</p>
        ) : (
          list.map((item) => (
            <div key={item._id} className="list-table-format">
              <img
                src={`${url}/images/${item.image}`}
                alt={item.name}
                width={80}
                height={80}
              />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>

              <button
                className={item.available ? "available-btn" : "unavailable-btn"}
                onClick={() => toggleAvailability(item._id, item.available)}
                disabled={loadingId === item._id}
              >
                {item.available ? "Available" : "Unavailable"}
              </button>

              <button
                className="remove-btn"
                onClick={() => handleRemove(item._id)}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default List;
