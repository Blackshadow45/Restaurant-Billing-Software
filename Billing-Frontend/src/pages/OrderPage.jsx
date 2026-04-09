import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function OrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");

  const [showVariantModal, setShowVariantModal] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const [paymentMode, setPaymentMode] = useState("CASH");
  const [showBillPreview, setShowBillPreview] = useState(false);

  useEffect(() => {
    fetchOrder();
    fetchMenu();
  }, []);

  const fetchOrder = async () => {
    const res = await api.get(`/orders/order/${orderId}`);
    setOrder(res.data);
  };

  const fetchMenu = async () => {
    const restaurantId = localStorage.getItem("restaurantId");
    const res = await api.get(`/menu/${restaurantId}`);

    const available = res.data.filter(i => i.available);
    setMenu(available);

    const uniqueCategories = [...new Set(available.map(i => i.category))];
    setCategories(uniqueCategories);
    setActiveCategory(uniqueCategories[0] || "");
  };

  if (!order) return <p>Loading...</p>;
  const isPaid = order.status === "PAID";

  /* ---------------- ADD ITEM ---------------- */
  const handleMenuClick = (item) => {
    if (isPaid) return;

    if (item.hasHalf) {
      setSelectedMenuItem(item);
      setShowVariantModal(true);
    } else {
      addItemToOrder(item, "FULL");
    }
  };

  const addItemToOrder = async (item, variant) => {
    const price = item.hasHalf
      ? variant === "HALF"
        ? item.prices.half
        : item.prices.full
      : item.price;

    await api.post(`/orders/${orderId}/add-item`, {
      name: item.name,
      variant,
      price,
      quantity: 1,
    });

    setShowVariantModal(false);
    setSelectedMenuItem(null);
    fetchOrder();
  };

  const updateQty = async (index, delta) => {
    if (isPaid) return;
    await api.put(`/orders/${orderId}/item/${index}?delta=${delta}`);
    fetchOrder();
  };

 const printBill = async () => {
  try {
    const printContent = document.querySelector(".bill-print");
    if (!printContent) {
      alert("Nothing to print");
      return;
    }

    const printWindow = window.open("", "", "width=400,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Bill</title>
          <style>
            body { font-family: Arial; padding: 10px; }
            h3 { text-align: center; }
            hr { margin: 10px 0; }
          </style>
        </head>
        <body>${printContent.innerHTML}</body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();

    // ✅ Close order only AFTER printing
    await api.put(`/orders/${orderId}/close?paymentMode=${paymentMode}`);

    navigate("/dashboard", { replace: true });
  } catch (err) {
    alert("Print failed");
    console.error(err);
  }
};


  const filteredMenu = menu.filter(
    (i) => i.category === activeCategory
  );

  /// kot print function
  const printKOT = async () => {
  try {
    const unsentItems = order.items.filter(i => !i.sentToKitchen);

    if (unsentItems.length === 0) {
      alert("No new items for KOT");
      return;
    }

    const kotHtml = `
      <h3 style="text-align:center">KOT</h3>
      <hr/>
      <p><strong>Table:</strong> ${order.tableNumber}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
      <hr/>
      ${unsentItems.map(i => `
        <div style="display:flex; justify-content:space-between">
          <span>${i.name} ${i.variant ? "(" + i.variant + ")" : ""}</span>
          <strong>x ${i.quantity}</strong>
        </div>
      `).join("")}
    `;

    const printWindow = window.open("", "", "width=300,height=500");
    printWindow.document.write(`
      <html>
        <body>${kotHtml}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();

    // ✅ Mark items as sent to kitchen
    await api.put(`/orders/${orderId}/kot`);

    fetchOrder();
  } catch (err) {
    alert("Failed to print KOT");
    console.error(err);
  }
};


  return (
    <>
      {/* ================= LAYOUT ================= */}
      <div style={styles.container}>

        {/* ---------- LEFT : CATEGORY BAR ---------- */}
        <div style={styles.sidebar}>
          <h3 style={{ marginBottom: 10 }}>Categories</h3>

          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                ...styles.categoryBtn,
                background: activeCategory === cat ? "#2e7d32" : "#eee",
                color: activeCategory === cat ? "white" : "black",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ---------- CENTER : MENU GRID ---------- */}
        <div style={styles.menuArea}>
          <h2>{activeCategory}</h2>

          <div style={styles.menuGrid}>
            {filteredMenu.map(item => (
              <div
                key={item.id}
                onClick={() => handleMenuClick(item)}
                style={styles.menuCard}
              >
                <strong>{item.name}</strong>

                <div style={{ marginTop: 6 }}>
                  {item.hasHalf
                    ? `₹${item.prices.full} | Half ₹${item.prices.half}`
                    : `₹${item.price}`}
                </div>

                {item.hasHalf && (
                  <span style={styles.badge}>Half</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ---------- RIGHT : ORDER SUMMARY ---------- */}
        <div style={styles.orderPanel}>
          <h3>Order Summary</h3>

          <div style={{ flex: 1, overflowY: "auto" }}>
            {order.items.map((item, index) => (
              <div key={index} style={styles.orderRow}>
                <div>
                  {item.name} ({item.variant})
                  <div style={{ fontSize: 12 }}>
                    ₹{item.price} × {item.quantity}
                  </div>
                  {/* ✅ KOT STATUS BADGE */}
                    {item.sentToKitchen && (
                      <div style={{ fontSize: 11, color: "green" }}>
                        ✔ KOT Sent
                      </div>
                    )}
                </div>

                <div>
                  <button onClick={() => updateQty(index, -1)}>−</button>
                  <span style={{ margin: "0 6px" }}>{item.quantity}</span>
                  <button onClick={() => updateQty(index, 1)}>+</button>
                </div>

                <strong>₹{item.price * item.quantity}</strong>
              </div>
            ))}

           

          </div>

          <hr />

          <h3>Total ₹{order.totalAmount}</h3>

          <div style={{ display: "flex", gap: 10 }}>
            <button style={styles.kotBtn} onClick={printKOT}>
                  KOT
            </button>

            <button
              style={styles.billBtn}
              onClick={() => setShowBillPreview(true)}
            >
              BILL
            </button>
          </div>

          <button
            style={styles.backBtn}
            onClick={() => navigate("/dashboard")}
          >
            ⬅ Back
          </button>
        </div>
      </div>

      {/* ---------- HALF / FULL MODAL ---------- */}
      {showVariantModal && selectedMenuItem && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <h3>{selectedMenuItem.name}</h3>

            <button onClick={() => addItemToOrder(selectedMenuItem, "HALF")}>
              Half ₹{selectedMenuItem.prices.half}
            </button>

            <button onClick={() => addItemToOrder(selectedMenuItem, "FULL")}>
              Full ₹{selectedMenuItem.prices.full}
            </button>

            <button onClick={() => setShowVariantModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ---------- BILL PREVIEW ---------- */}
      {showBillPreview && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard} className="bill-print">
            <h3>Bill Preview</h3>

            {order.items.map((i, idx) => (
              <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
                <span>{i.name} × {i.quantity}</span>
                <span>₹{i.price * i.quantity}</span>
              </div>
            ))}

            <hr />
            <strong>Total ₹{order.totalAmount}</strong>

            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
            </select>

            <button onClick={printBill}>Complete Payment</button>
            <button onClick={() => setShowBillPreview(false)}>Back</button>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#f4f6f8",
  },

  sidebar: {
    width: "180px",
    background: "#fff",
    padding: "12px",
    borderRight: "1px solid #ddd",
  },

  categoryBtn: {
    width: "100%",
    padding: "10px",
    marginBottom: "8px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  menuArea: {
    flex: 1,
    padding: "16px",
    overflowY: "auto",
  },

  menuGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
    gap: "12px",
  },

  menuCard: {
    background: "#fff",
    borderRadius: "10px",
    padding: "14px",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    background: "#e3f2fd",
    color: "#1976d2",
    fontSize: 12,
    padding: "2px 6px",
    borderRadius: "8px",
  },

  orderPanel: {
    width: "300px",
    background: "#fff",
    padding: "14px",
    borderLeft: "1px solid #ddd",
    display: "flex",
    flexDirection: "column",
  },

  orderRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  kotBtn: {
    flex: 1,
    background: "#ff9800",
    border: "none",
    padding: "10px",
    color: "white",
    borderRadius: "6px",
  },

  billBtn: {
    flex: 1,
    background: "#2e7d32",
    border: "none",
    padding: "10px",
    color: "white",
    borderRadius: "6px",
  },

  backBtn: {
    marginTop: 10,
    padding: "8px",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    minWidth: "260px",
  },
};
