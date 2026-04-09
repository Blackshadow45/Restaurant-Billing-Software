import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    gstNumber: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");

    try {
      await api.post("/restaurants/register", {
        ...form,
        role: "OWNER", // 🔐 VERY IMPORTANT
      });

      navigate("/login");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Create Restaurant Account</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input name="name"  placeholder="Restaurant Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <input name="mobile" placeholder="Mobile Number" onChange={handleChange} />
        <input name="address" placeholder="Address" onChange={handleChange} />
        <input name="gstNumber" placeholder="GST Number (optional)" onChange={handleChange} />

        <button onClick={handleRegister}>Create Account</button>
      </div>
    </div>
  );
}
