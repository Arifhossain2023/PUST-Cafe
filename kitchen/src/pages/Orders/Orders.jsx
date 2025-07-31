import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../assets/assets";
import "./Orders.css";
import { toast } from "react-toastify"; // ✅ Toast import

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [showInput, setShowInput] = useState(null);
  const [usedItemsMap, setUsedItemsMap] = useState({});

  const getToken = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return null;
    try {
      const user = JSON.parse(storedUser);
      return user.token || null;
    } catch {
      return null;
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/order/list`);
      if (res.data.success) {
        setOrders(res.data.data); // oldest first
      }
    } catch (error) {
      console.error("Kitchen Fetch Failed:", error);
    }
  };

  const fetchIngredients = async () => {
    try {
      const res = await axios.get(`${url}/api/inventory/list`);
      if (res.data.success) {
        setIngredients(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load ingredients", err);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.post(
        `${url}/api/order/status`,
        { orderId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) fetchOrders();
    } catch (error) {
      console.error("Kitchen Status Update Failed:", error);
    }
  };

  const handleUsedItemChange = (orderId, index, field, value) => {
    const updated = [...(usedItemsMap[orderId] || [{ name: '', quantity: '' }])];
    updated[index][field] = value;
    setUsedItemsMap({ ...usedItemsMap, [orderId]: updated });
  };

  const addUsedItemRow = (orderId) => {
    const updated = [...(usedItemsMap[orderId] || [])];
    updated.push({ name: '', quantity: '' });
    setUsedItemsMap({ ...usedItemsMap, [orderId]: updated });
  };

  const submitUsedItems = async (orderId) => {
    try {
      const rawItems = usedItemsMap[orderId] || [];

      const filteredItems = rawItems.filter(
        item => item.name && item.quantity && Number(item.quantity) > 0
      );

      if (filteredItems.length === 0) {
        toast.error("❌ Please add at least one valid ingredient.");
        return;
      }

      const payload = {
        orderId,
        usedItems: filteredItems,
      };

      const res = await axios.post(`${url}/api/inventory/use`, payload);

      if (res.data.success) {
        toast.success("Inventory updated successfully!");
      } else {
        toast.error("Failed to update inventory.");
      }

      await updateStatus(orderId, "Ready");
      setShowInput(null);
    } catch (error) {
      console.error("Inventory update failed:", error);
      toast.error("Server error. Please try again.");
    }
  };

  const readyOrders = orders.filter(order => order.status === 'Ready');
  const pendingOrders = orders.filter(order => order.status !== 'Ready');

  useEffect(() => {
    fetchOrders();
    fetchIngredients();
    const interval = setInterval(() => {
      fetchOrders();
      fetchIngredients();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="kitchen-orders">
      {/*  Pending Orders */}
      <h3>Pending Orders</h3>
      {pendingOrders.length === 0 ? (
        <p>No pending orders.</p>
      ) : (
        <div className="orders-list">
          {pendingOrders.map((order) => (
            <div
              key={order._id}
              className="order-card"
              style={{
                backgroundColor: order.status === "Preparing" ? "#fff3cd" : "#fff",
              }}
            >
              <p><strong>Items:</strong> {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
              <p><strong>Status:</strong> {order.status}</p>

              <div className="order-buttons">
                <button onClick={() => updateStatus(order._id, "Preparing")}>Preparing</button>
                <button onClick={() => setShowInput(order._id)}>Ready</button>
              </div>

              {showInput === order._id && (
                <div className="ingredient-popup">
                  <h4>Used Ingredients</h4>
                  {(usedItemsMap[order._id] || [{ name: '', quantity: '' }]).map((item, idx) => (
                    <div key={idx} className="ingredient-row">
                      <select
                        value={item.name}
                        onChange={(e) => handleUsedItemChange(order._id, idx, "name", e.target.value)}
                      >
                        <option value="">Select ingredient</option>
                        {ingredients.map((ing) => (
                          <option key={ing._id} value={ing.name}>{ing.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleUsedItemChange(order._id, idx, "quantity", e.target.value)}
                      />
                    </div>
                  ))}
                  <button className="add-btn" onClick={() => addUsedItemRow(order._id)}>+ Add</button>
                  <button className="submit-btn" onClick={() => submitUsedItems(order._id)}>Submit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ready Orders */}
      <h3>Ready Orders</h3>
      {readyOrders.length === 0 ? (
        <p>No ready orders yet.</p>
      ) : (
        <div className="orders-list">
          {readyOrders.map((order) => (
            <div key={order._id} className="order-card">
              <p><strong>Items:</strong> {order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}</p>
              <p><strong>Status:</strong> {order.status}</p>

              <button className="edit-btn" onClick={() => setShowInput(order._id)}>Edit Ingredients</button>

              {showInput === order._id && (
                <div className="ingredient-popup">
                  <h4>Edit Used Ingredients</h4>
                  {(usedItemsMap[order._id] || [{ name: '', quantity: '' }]).map((item, idx) => (
                    <div key={idx} className="ingredient-row">
                      <select
                        value={item.name}
                        onChange={(e) => handleUsedItemChange(order._id, idx, "name", e.target.value)}
                      >
                        <option value="">Select ingredient</option>
                        {ingredients.map((ing) => (
                          <option key={ing._id} value={ing.name}>{ing.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={item.quantity}
                        onChange={(e) => handleUsedItemChange(order._id, idx, "quantity", e.target.value)}
                      />
                    </div>
                  ))}
                  <button className="add-btn" onClick={() => addUsedItemRow(order._id)}>+ Add</button>
                  <button className="submit-btn" onClick={() => submitUsedItems(order._id)}>Update</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
