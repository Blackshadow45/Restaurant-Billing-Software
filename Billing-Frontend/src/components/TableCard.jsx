import "../styles/Tablecard.css";

export default function TableCard({ table, onClick, onActionClick }) {
  return (
    <div
      className={`table-card ${table.status.toLowerCase()}`}
      onClick={onClick}
    >
      {/* ⚙️ Only for merged tables */}
      {table.status === "MERGED" && (
        <button
          className="table-action-btn"
          onClick={(e) => {
            e.stopPropagation(); // prevent card click
            onActionClick(table);
          }}
        >
          ⚙️
        </button>
      )}

      <div className="table-icon">🪑</div>
      <h3>Table {table.tableNumber}</h3>
      <span className="table-status">
        {table.status === "MERGED" ? "Merged" : table.status}
      </span>
    </div>
  );
}
