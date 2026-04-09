export default function Navbar() {
  const restaurantName =
    localStorage.getItem("restaurantName") || "Restaurant";

  return (
    <div className="navbar">
      <h2>🏪 {restaurantName}</h2>

      <button onClick={() => {
        localStorage.clear();
        window.location.href = "/";
      }}>
        Logout
      </button>
    </div>
  );
}
