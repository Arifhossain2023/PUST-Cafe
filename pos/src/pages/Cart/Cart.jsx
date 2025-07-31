import React, { useEffect, useState } from 'react';
import './Cart.css';
import axios from 'axios';
import { url } from '../../assets/assets';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = () => {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [total, setTotal] = useState(0);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = user?.token || null;

  const fetchTables = async () => {
    try {
      const res = await axios.get(`${url}/api/table/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setTables(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Error loading tables");
    }
  };

  const fetchOrdersByTable = async (tableId) => {
    try {
      const res = await axios.get(`${url}/api/order/table/${tableId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success && res.data.data && res.data.data.length > 0) {
        setOrders(res.data.data[0].items);
        calculateTotal(res.data.data[0].items);
      } else {
        setOrders([]);
        setTotal(0);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch table order");
      setOrders([]);
      setTotal(0);
    }
  };

  const handleQuantityChange = (index, delta) => {
    const updated = [...orders];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    setOrders(updated);
    calculateTotal(updated);
  };

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(sum);
  };

  const updateOrder = async () => {
    try {
      if (!selectedTable) {
        toast.error("Please select a table first");
        return;
      }
      if (orders.length === 0) {
        toast.error("No items to update");
        return;
      }

      const updatedItems = orders.map(item => ({
        foodId: item.foodId || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const res = await axios.post(`${url}/api/order/update`, {
        tableId: selectedTable,
        items: updatedItems,
        amount: total,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Order updated successfully");  // <-- Toast here!
      } else {
        toast.error("Failed to update order");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating order");
    }
  };

  useEffect(() => {
    fetchTables();
    const selected = localStorage.getItem("selectedTable");
    if (selected) {
      setSelectedTable(selected);
      fetchOrdersByTable(selected);
    }
  }, []);

  useEffect(() => {
    if (selectedTable) {
      localStorage.setItem("selectedTable", selectedTable);
      fetchOrdersByTable(selectedTable);
    } else {
      setOrders([]);
      setTotal(0);
    }
  }, [selectedTable]);

  return (
    <div className="cart-page">
      <h2>Table Orders</h2>

      <div className="cart-actions">
        <label>Select Table:</label>
        <select value={selectedTable} onChange={(e) => setSelectedTable(e.target.value)}>
          <option value="">-- Select Table --</option>
          {tables.map(table => (
            <option key={table._id} value={table._id}>
              Table {table.number} ({table.status})
            </option>
          ))}
        </select>
      </div>

      {orders.length > 0 ? (
        <>
          <div className="cart-table">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                  <th>Change</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((item, i) => (
                  <tr key={i}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>৳{item.price}</td>
                    <td>৳{(item.quantity * item.price).toFixed(2)}</td>
                    <td>
                      <button onClick={() => handleQuantityChange(i, 1)}>+</button>
                      <button onClick={() => handleQuantityChange(i, -1)}>-</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>Total: ৳{total.toFixed(2)}</h3>
          <button className="place-order-btn" onClick={updateOrder}>
            Update Order
          </button>
        </>
      ) : (
        <p>No orders for this table</p>
      )}

      {/* ToastContainer MUST be present somewhere in your app */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Cart;
