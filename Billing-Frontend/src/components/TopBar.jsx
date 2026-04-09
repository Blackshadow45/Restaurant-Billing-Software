import "../styles/topbar.css";

export default function TopBar() {

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        🍽 <strong>My Restaurant</strong>
      </div>

      <div className="topbar-right">
        <span>{new Date().toLocaleTimeString()}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
