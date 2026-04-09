import api from "../api/axios";

export default function MenuItemCard({ item, refresh }) {

  const toggleAvailability = async () => {
    await api.put(`/menu/toggle/${item.id}`);
    refresh();
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        marginBottom: "10px",
        opacity: item.available ? 1 : 0.5
      }}
    >
      <strong>{item.name}</strong> ({item.category})

      {item.hasHalf ? (
        <div>
          Half ₹{item.prices.half} | Full ₹{item.prices.full}
        </div>
      ) : (
        <div>₹{item.price}</div>
      )}

      <button onClick={toggleAvailability}>
        {item.available ? "Disable ❌" : "Enable ✅"}
      </button>
    </div>
  );
}
