import { useState } from "react";
import api from "../api/axios";
import "../styles/modal.css";

export default function AddTableModal({ restaurantId, onClose, onSuccess }) {
  const [tableNumber, setTableNumber] = useState("");

  const handleAdd = async () => {
    try {
      await api.post("/tables", {
        restaurantId,
        tableNumber,
        status: "FREE",
      });

      onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to add table");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Add Table</h3>

        <input
          type="text"
          placeholder="Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={handleAdd}>Add</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
