import React, { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../assets/assets";
import "./Menu.css";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({});
  const [selectedTable, setSelectedTable] = useState(null);
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  // Get user token
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const token = user ? user.token : null;

  // Fetch menu items
  const fetchMenu = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setMenuItems(res.data.data);
    } catch (error) {
      console.error("Failed to load menu", error);
    }
  };

  // Fetch tables (to show table number)
  const fetchTables = async () => {
    try {
      const res = await axios.get(`${url}/api/table/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setTables(res.data.data);
    } catch (error) {
      console.error("Failed to load tables", error);
    }
  };

  useEffect(() => {
    fetchMenu();
    fetchTables();

    socket.on("foodAvailabilityUpdated", ({ id, available }) => {
      setMenuItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, available } : item))
      );
    });

    // Get selected table from localStorage on mount
    const tableId = localStorage.getItem("selectedTable");
    if (tableId) setSelectedTable(tableId);

    return () => socket.off("foodAvailabilityUpdated");
  }, []);

  const addToCart = (item) => {
    if (!item.available) return;
    setCart((prev) => {
      const quantity = prev[item._id] ? prev[item._id].quantity + 1 : 1;
      return {
        ...prev,
        [item._id]: { ...item, quantity },
      };
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => {
      if (!prev[itemId]) return prev;
      const quantity = prev[itemId].quantity - 1;
      if (quantity <= 0) {
        const newCart = { ...prev };
        delete newCart[itemId];
        return newCart;
      } else {
        return {
          ...prev,
          [itemId]: { ...prev[itemId], quantity },
        };
      }
    });
  };

  const totalAmount = Object.values(cart).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!selectedTable) {
      alert("Please select a table before placing the order.");
      return;
    }
    if (Object.keys(cart).length === 0) {
      alert("Cart is empty");
      return;
    }

    const orderItems = Object.values(cart).map((item) => ({
      foodId: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    try {
      const res = await axios.post(
        `${url}/api/order/place`,
        {
          tableId: selectedTable,
          items: orderItems,
          amount: totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token must be sent here
          },
        }
      );

      if (res.data.success) {
        alert("Order placed successfully!");
        setCart({});
        localStorage.removeItem("selectedTable");
        setSelectedTable(null);
        navigate("/tables");
      } else {
        alert("Failed to place order: " + res.data.message);
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Error placing order: " + (error.response?.data?.message || error.message));
    }
  };

  // Find selected table object for showing table number
  const selectedTableObj = tables.find((t) => t._id === selectedTable);

  return (
    <div className="menu-page">
      <h2>Menu</h2>
      <div className="menu-items">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className={`menu-item-card ${!item.available ? "unavailable" : ""}`}
          >
            <img src={`${url}/images/${item.image}`} alt={item.name} />
            <h4>{item.name}</h4>
            <p className={`status-label ${item.available ? "available" : "unavailable"}`}>
              {item.available ? "Available" : "Unavailable"}
            </p>
            <div className="menu-item-actions">
              <button onClick={() => removeFromCart(item._id)} disabled={!cart[item._id]}>
                -
              </button>
              <span>{cart[item._id]?.quantity || 0}</span>
              <button onClick={() => addToCart(item)} disabled={!item.available}>
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary centered-cart-summary">
        <h3>Cart Summary</h3>
        {selectedTable ? (
          <p>
            <strong>Selected Table:</strong> Table {selectedTableObj?.number || selectedTable}
          </p>
        ) : (
          <p style={{ color: "red" }}>No table selected</p>
        )}
        {Object.values(cart).length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <ul>
            {Object.values(cart).map((item) => (
              <li key={item._id}>
                {item.name} x {item.quantity} = ৳{(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
        )}
        <h4>Total: ৳{totalAmount.toFixed(2)}</h4>
        <button disabled={Object.keys(cart).length === 0} onClick={placeOrder}>
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Menu;
