import axios from "axios";

const API = "http://localhost:8080/restaurants/login";

export const login = async (email, password) => {
  try {
    const res = await axios.post(API, { email, password });
    localStorage.setItem("token", res.data.token);
    window.location.href = "/dashboard";
  } catch (err) {
    alert("Invalid credentials");
  }
};
