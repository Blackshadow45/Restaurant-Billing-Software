import { useState } from "react";
import "../styles/orderModal.css";

export default function OrderModal({ table, onClose, refreshTables }) {
  const [items, setItems] = useState([]);

  // TEMP MENU (next step backend)
  const menu = [
    { id: 1, name: "Paneer Masala", price: 220 },
    { id: 2, name: "Butter Roti", price: 30 },
  ];

  const addItem = (item) => {
    setItems((prev) => [...prev, item]);
  };

  return (
    <div className="modal-overlay">
      <div className="order-modal">

        <div className="modal-header">
          <h2>Table {table.tableNumber}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="menu-section">
            {menu.map((m) => (
              <button key={m.id} onClick={() => addItem(m)}>
                {m.name} ₹{m.price}
              </button>
            ))}
          </div>

          <div className="summary-section">
            <h3>Order</h3>
            {items.map((i, idx) => (
              <p key={idx}>{i.name}</p>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="primary">Generate Bill</button>
        </div>

      </div>
    </div>
  );
}
