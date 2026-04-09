import { useState } from "react";
import api from "../api/axios";
import "../styles/modal.css";

export default function ManageTablesModal({
  restaurantId,
  tables,
  onClose,
  onUpdate,
}) {
  const [tableNumber, setTableNumber] = useState("");

  const addTable = async () => {
    await api.post("/tables", {
      restaurantId,
      tableNumber,
      status: "FREE", // industry standard
    });
    setTableNumber("");
    onUpdate();
  };

  const deleteTable = async (tableId) => {
    if (!window.confirm("Delete table permanently?")) return;
    await api.delete(`/tables/${tableId}`);
    onUpdate();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Manage Tables</h3>

        {/* ADD TABLE */}
        <input
          placeholder="New Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
        />
        <button onClick={addTable}>Add Table</button>

        <hr />

        {/* EXISTING TABLES */}
        <ul>
          {tables.map((t) => (
            <li key={t.id} className="manage-row">
              <span>Table {t.tableNumber}</span>
              <button onClick={() => deleteTable(t.id)}>Delete</button>
            </li>
          ))}
        </ul>

        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
