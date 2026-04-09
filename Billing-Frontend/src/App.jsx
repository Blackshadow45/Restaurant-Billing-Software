import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Order from "./pages/Order";
import OrderPage from "./pages/OrderPage";
import MenuManagement from "./pages/MenuManagement";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/order/:orderId" element={<OrderPage />} />
        <Route path="/menu-management" element={<MenuManagement/>}/>
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;
