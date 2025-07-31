import { createContext, useEffect, useState } from "react";
import { food_list as static_food_list, menu_list } from "../assets/assets";
import axios from "axios";
import { io } from "socket.io-client";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = "http://localhost:4000"; // ✅ assets থেকেও আনতে পারো
  const socket = io(url); // ✅ socket for real-time update

  const [foodList, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [showProfileModal, setShowProfileModal] = useState(false);

  // ✅ Add to Cart
  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...(prev || {}),
      [itemId]: (prev?.[itemId] || 0) + 1,
    }));

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/add`,
          { itemId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (err) {
        console.error("Add to cart failed", err);
      }
    }
  };

  // ✅ Remove from Cart
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...(prev || {}) };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });

    if (token) {
      try {
        await axios.post(
          `${url}/api/cart/remove`,
          { itemId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } catch (err) {
        console.error("Remove from cart failed", err);
      }
    }
  };

  // ✅ Total Cart Amount
  const getTotalCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const item = foodList.find((f) => f._id === itemId);
      if (item) {
        total += item.price * cartItems[itemId];
      }
    }
    return total;
  };

  // ✅ Fetch Food List
  const fetchFoodList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      setFoodList(res.data.data);
    } catch (err) {
      console.error("Failed to fetch food list", err);
      setFoodList(static_food_list);
    }
  };

  // ✅ Load Cart Data after login
  const loadCartData = async (overrideToken = null) => {
    const usedToken = overrideToken || token;
    if (!usedToken) return;

    try {
      const res = await axios.post(
        `${url}/api/cart/get`,
        {},
        {
          headers: { Authorization: `Bearer ${usedToken}` },
        }
      );

      if (res.data.cartData && typeof res.data.cartData === "object") {
        setCartItems(res.data.cartData);
      } else {
        setCartItems({});
      }
    } catch (err) {
      console.error("Cart fetch failed", err);
      setCartItems({});
    }
  };

  // ✅ Toggle Availability (Admin)
  const toggleAvailability = async (id, currentStatus) => {
    try {
      const res = await axios.post(
        `${url}/api/food/toggleAvailability`,
        {
          id,
          available: !currentStatus,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setFoodList((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, available: !currentStatus } : item
          )
        );
      } else {
        console.error("Toggle failed:", res.data.message);
      }
    } catch (err) {
      console.error("Error toggling availability:", err);
    }
  };

  // ✅ Init Load
  useEffect(() => {
    const init = async () => {
      await fetchFoodList();
      await loadCartData();
    };
    init();

    // 🟢 socket update for real-time availability
    socket.on("foodAvailabilityUpdated", ({ id, available }) => {
      setFoodList((prev) =>
        prev.map((item) => (item._id === id ? { ...item, available } : item))
      );
    });

    return () => socket.disconnect();
  }, []);

  // ✅ Final Context Values
  const contextValue = {
    url,
    food_list: foodList,
    menu_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    loadCartData,
    setCartItems,
    user,
    setUser,
    showProfileModal,
    setShowProfileModal,
    toggleAvailability,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
