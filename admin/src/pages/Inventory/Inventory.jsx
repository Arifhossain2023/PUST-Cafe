import React, { useEffect, useState } from 'react';
import './Inventory.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { url } from '../../assets/assets';

const ITEMS_PER_PAGE = 5;

const Inventory = () => {
  const [ingredients, setIngredients] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);

  // ✅ Fetch all inventory
  const fetchIngredients = async () => {
    try {
      const res = await axios.get(`${url}/api/inventory/list`);
      if (res.data.success) setIngredients(res.data.data);
      else toast.error("Failed to load inventory");
    } catch (err) {
      toast.error("Error fetching inventory");
    }
  };

  // ✅ Add or update item
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.quantity) {
      return toast.error("All fields are required");
    }

    if (editingId) {
      try {
        // 🔁 Get existing item to add quantity
        const existingItem = ingredients.find(item => item._id === editingId);
        const totalQuantity = Number(existingItem.quantity) + Number(newItem.quantity);

        const res = await axios.put(`${url}/api/inventory/update`, {
          id: editingId,
          name: newItem.name,
          quantity: totalQuantity, // ✅ Add to previous
        });

        if (res.data.success) {
          toast.success("Quantity updated (added)");
        } else {
          toast.error("Update failed");
        }
      } catch (err) {
        toast.error("Error updating item");
      }

      setEditingId(null);
    } else {
      try {
        const res = await axios.post(`${url}/api/inventory/add`, newItem);
        if (res.data.success) toast.success("Item added");
        else toast.error("Failed to add item");
      } catch (err) {
        toast.error("Error adding item");
      }
    }

    setNewItem({ name: '', quantity: '' });
    fetchIngredients();
  };

  // ✅ Delete item
  const handleDelete = async (id) => {
    try {
      const res = await axios.post(`${url}/api/inventory/delete`, { id });
      if (res.data.success) {
        toast.success("Item deleted");
        fetchIngredients();
      } else {
        toast.error("Delete failed");
      }
    } catch (err) {
      toast.error("Error deleting item");
    }
  };

  // ✅ Edit item (to add more)
  const handleEdit = (item) => {
    setNewItem({ name: item.name, quantity: '' }); // blank input for additional quantity
    setEditingId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(ingredients.length / ITEMS_PER_PAGE);
  const paginatedItems = ingredients.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => {
    fetchIngredients();
  }, []);

  return (
    <div className="inventory-page add flex-col">
      <h2>Inventory & Stock</h2>

      {/* ✅ Form */}
      <form onSubmit={handleSubmit} className="inventory-form">
        <input
          type="text"
          placeholder="Ingredient name"
          value={newItem.name}
          required
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          disabled={!!editingId} // 🔒 Prevent name change while editing
        />
        <input
          type="number"
          placeholder={editingId ? "Add quantity" : "Quantity"}
          value={newItem.quantity}
          required
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
        />
        <button type="submit">{editingId ? 'Update (Add)' : 'Add'}</button>
      </form>

      {/* ✅ Table Header */}
      <div className="inventory-header">
        <span>Product Name</span>
        <span>Quantity</span>
        <span>Actions</span>
      </div>

      {/* ✅ List */}
      <div className="inventory-list">
        {paginatedItems.map((item) => (
          <div key={item._id} className="inventory-item">
            <span>{item.name}</span>
            <span>
              {item.quantity}
              {item.quantity < 10 && <strong className="low-stock"> (Low Stock)</strong>}
            </span>
            <span className="actions">
              <button onClick={() => handleEdit(item)}>✎</button>
              <button onClick={() => handleDelete(item._id)}>✖</button>
            </span>
          </div>
        ))}
      </div>

      {/* ✅ Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={page === i + 1 ? 'active' : ''}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
