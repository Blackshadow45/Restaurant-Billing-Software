import { useEffect, useState } from "react";
import api from "../api/axios";
import TableCard from "../components/TableCard";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);

  // ✅ Merge states
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [mergeSelection, setMergeSelection] = useState([]);

  const navigate = useNavigate();
  const restaurantId = localStorage.getItem("restaurantId");

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await api.get(`/orders/tables/status/${restaurantId}`);
      setTables(res.data);
    } catch (err) {
      console.error("Failed to load table status", err);
    }
  };

  // ▶️ Start new order
  const startOrder = async () => {
    try {
      const res = await api.post(
        `/orders/${restaurantId}?tableNumber=${selectedTable.tableNumber}`
      );

      setSelectedTable(null);
      fetchTables();
      navigate(`/order/${res.data.id}`);
    } catch {
      alert("Failed to start order");
    }
  };

  // 🔓 Open existing order (Normal + Merged)
  const handleOpenOrder = async (table) => {
    try {
      const res = await api.get(
        `/orders/open?restaurantId=${restaurantId}&tableNumber=${table.tableNumber}`
      );

      navigate(`/order/${res.data.id}`);
    } catch (err) {
      alert("No open order found for this table");
      console.error(err);
    }
  };

  const activeCount = tables.filter(
    (t) => t.status === "BUSY" || t.status === "MERGED"
  ).length;

  // ================= MERGE LOGIC =================

  const freeTables = tables.filter((t) => t.status === "FREE");

  const toggleMergeSelect = (tableNumber) => {
    setMergeSelection((prev) =>
      prev.includes(tableNumber)
        ? prev.filter((n) => n !== tableNumber)
        : [...prev, tableNumber]
    );
  };

  const confirmMerge = async () => {
    if (mergeSelection.length < 2) return;

    try {
      await api.post("/orders/merge", {
        restaurantId,
        tables: mergeSelection,
      });

      setMergeSelection([]);
      setShowMergeModal(false);
      fetchTables();
    } catch (err) {
      alert("Merge failed");
      console.error(err);
    }
  };

  // ================= ✅ UNMERGE LOGIC (FIXED) =================

  const handleUnmerge = async () => {
    if (!selectedTable) return;

    try {
      // 1️⃣ Find merged order first
      const res = await api.get(
        `/orders/open?restaurantId=${restaurantId}&tableNumber=${selectedTable.tableNumber}`
      );

      const orderId = res.data.id;

      // 2️⃣ Delete merged order
      await api.delete(`/orders/unmerge/${orderId}`);

      alert("Tables unmerged successfully ✅");

      // 3️⃣ Refresh UI
      setSelectedTable(null);
      fetchTables();
    } catch (err) {
      alert("Unmerge failed ❌");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      {/* ================= HEADER ================= */}
      <div className="dashboard-header">
        <h2>Dashboard</h2>

        <div className="dashboard-actions">
          <button onClick={() => navigate("/menu-management")}>🍽 Menu</button>
          <button disabled>📦 KOT</button>
          <button disabled>📊 Reports</button>
        </div>
      </div>

      {/* ================= KPI ================= */}
      <div className="kpi-bar">
        <div className="kpi-card">
          <p>Active Tables</p>
          <h3>{activeCount}</h3>
        </div>

        <div className="kpi-card">
          <p>Total Tables</p>
          <h3>{tables.length}</h3>
        </div>

        <div className="kpi-card muted">
          <p>Today Sales</p>
          <h3>₹ —</h3>
        </div>
      </div>

      {/* ================= TABLE AREA ================= */}
      <div className="dashboard-body">
        <div className="table-scroll-area">
          <div className="table-grid">
            {tables.map((table) => (
              <TableCard
                key={`${table.tableNumber}-${table.status}`}
                table={table}

                // 🖱 Card Click
                onClick={() => {
  if (table.status === "FREE") {
    setSelectedTable(table); // only free shows modal
  } else {
    handleOpenOrder(table); // BUSY + MERGED → direct open
  }
}}


                // ⚙️ Action Button Click (Only for merged)
                onActionClick={(table) => {
                  setSelectedTable(table); // open unmerge modal
                }}
              />
            ))}
          </div>
        </div>

        {/* Sticky Bottom Bar */}
        <div className="merge-bar">
          <button className="merge-btn" onClick={() => setShowMergeModal(true)}>
            🔗 Merge Tables
          </button>
        </div>
      </div>

      {/* ================= TABLE MODAL ================= */}
      {selectedTable && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>Table {selectedTable.tableNumber}</h2>
            <p>Status: {selectedTable.status}</p>

            {/* FREE TABLE */}
            {selectedTable.status === "FREE" && (
              <button className="primary-btn" onClick={startOrder}>
                Start Order
              </button>
            )}

            {/* MERGED TABLE */}
            {/* {selectedTable.status === "MERGED" && (
              <>
                <button
                  className="primary-btn"
                  onClick={() => handleOpenOrder(selectedTable)}
                >
                  📂 Open Order
                </button>

                <button
                  className="danger-btn"
                  onClick={handleUnmerge}
                >
                  🔓 Unmerge Tables
                </button>
              </>
            )} */}

            <button
              className="secondary-btn"
              onClick={() => setSelectedTable(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================= MERGE MODAL ================= */}
      {showMergeModal && (
        <div className="modal-overlay">
          <div className="modal-card merge-modal">
            <h3>Select Free Tables</h3>

            {freeTables.length === 0 && <p>No free tables available</p>}

            <div className="merge-list">
              {freeTables.map((t) => (
                <label key={t.tableNumber} className="merge-item">
                  <input
                    type="checkbox"
                    checked={mergeSelection.includes(t.tableNumber)}
                    onChange={() => toggleMergeSelect(t.tableNumber)}
                  />
                  Table {t.tableNumber}
                </label>
              ))}
            </div>

            <div className="merge-actions">
              <button
                disabled={mergeSelection.length < 2}
                onClick={confirmMerge}
                className="primary-btn"
              >
                Merge Selected
              </button>

              <button
                className="secondary-btn"
                onClick={() => {
                  setMergeSelection([]);
                  setShowMergeModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
