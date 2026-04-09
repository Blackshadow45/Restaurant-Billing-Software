import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
export default function MenuManagement() {
  const restaurantId = localStorage.getItem("restaurantId");
  
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({
  name: "",
  category: "",
  hasHalf: false,
  price: "",
  half: "",
  full: "",
});


  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const res = await api.get(`/menu/${restaurantId}`);
    setMenu(res.data);
  };

  // 📝 Handle input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ➕ ADD / ✏️ UPDATE MENU
 const saveMenuItem = async () => {
  
  if (!form.name || !form.category) {
  alert("Item name and category are required");
  return;
}

  const payload = {
    name: form.name,
    category: form.category,
    hasHalf: form.hasHalf,
    available: true,
    price: form.hasHalf ? 0 : Number(form.price),
    prices: form.hasHalf
      ? {
          half: Number(form.half),
          full: Number(form.full),
        }
      : null,
  };

  if (editingId) {
    await api.put(`/menu/update/${editingId}`, payload);
  } else {
    await api.post(`/menu/${restaurantId}`, payload);
  }

  resetForm();
  fetchMenu();
};


  const resetForm = () => {
    setForm({
  name: "",
  category: "",
  hasHalf: false,
  price: "",
  half: "",
  full: "",
});

    setEditingId(null);
  };

  // ✏️ EDIT
  const editItem = (item) => {
  setEditingId(item.id);
  setForm({
    name: item.name,
    category: item.category,
    hasHalf: item.hasHalf,
    price: item.hasHalf ? "" : item.price,
    half: item.prices?.half || "",
    full: item.prices?.full || "",
  });
};


  // 👁️ ENABLE / DISABLE
  const toggleAvailability = async (item) => {
    await api.put(`/menu/toggle/${item.id}`);
    fetchMenu();
  };

  const categories = ["ALL", ...new Set(menu.map(i => i.category))];


  return (
    <div style={{ padding: "20px" }}>
      <h2>🍽️ Menu Management (Owner)</h2>

      {/* ADD / EDIT FORM */}
      <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
        <h3>{editingId ? "Edit Item" : "Add New Item"}</h3>

        <input
          placeholder="Item Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        {/* CATEGORY SELECT */}
<select
  name="category"
  value={form.category}
  onChange={handleChange}
  style={{ padding: "8px", marginTop: "6px" }}
>
  <option value="">Select Category</option>

  {[...new Set(menu.map((i) => i.category))].map((cat) => (
    <option key={cat} value={cat}>
      {cat}
    </option>
  ))}
</select>

{/* NEW CATEGORY INPUT */}
<input
  placeholder="Or type new category"
  name="category"
  value={form.category}
  onChange={handleChange}
  style={{ marginTop: "6px" }}
/>


        <label>
          <input
            type="checkbox"
            name="hasHalf"
            checked={form.hasHalf}
            onChange={handleChange}
          />
          Has Half
        </label>
{form.hasHalf ? (
  <>
    <input
      placeholder="Half Price"
      name="half"
      value={form.half}
      onChange={handleChange}
    />

    <input
      placeholder="Full Price"
      name="full"
      value={form.full}
      onChange={handleChange}
    />
  </>
) : (
  <input
    placeholder="Price"
    name="price"
    value={form.price}
    onChange={handleChange}
  />
)}


        <button onClick={saveMenuItem}>
          {editingId ? "Update Item" : "Add Item"}
        </button>

        {editingId && <button onClick={resetForm}>Cancel</button>}
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
  {categories.map(cat => (
    <button
      key={cat}
      onClick={() => setSelectedCategory(cat)}
      style={{
        padding: "6px 12px",
        borderRadius: "16px",
        background: selectedCategory === cat ? "#1976d2" : "#eee",
        color: selectedCategory === cat ? "white" : "black",
        border: "none"
      }}
    >
      {cat}
    </button>
  ))}
</div>


      {/* MENU LIST */}
      <h3>📋 Menu Items</h3>

      {menu.filter(i => selectedCategory === "ALL" || i.category === selectedCategory)
  .map(item => (

        <div
          key={item.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "8px",
            opacity: item.available ? 1 : 0.4,
          }}
        >
          <strong>{item.name}</strong> ({item.category})
          <div>
            {item.hasHalf
              ? `Half ₹${item.prices.half} | Full ₹${item.prices.full}`
              : `₹${item.price}`}
          </div>

          <button onClick={() => editItem(item)}>Edit</button>
          <button onClick={() => toggleAvailability(item)}>
            {item.available ? "Disable" : "Enable"}
          </button>
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
  <button
    style={{
      padding: "12px 24px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      background: "#f5f5f5",
      cursor: "pointer"
    }}
    onClick={() => navigate("/dashboard")}
  >
    ⬅ Back to Dashboard
  </button>
</div>

    </div>
  );
}
