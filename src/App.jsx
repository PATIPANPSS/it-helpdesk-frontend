import { useEffect, useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CreateTicket from "./components/CreateTicket";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  const [isAuthentication, setIsAutentication] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAutentication(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAutentication(false);
  };

  return (
    <BrowserRouter>
      <nav className="p-4 text-white bg-gray-800 shadow-md">
        <div className="flex gap-6 mx-auto max-w-7xl">
          <h1 className="text-xl font-bold text-blue-400 mr-4">IT Helpdesk</h1>

          <Link to='/' className="px-3 py-1 font-medium transition-colors rounded hover:bg-gray-700">แจ้งปัญหา (ฝั่งผู้ใช้)</Link>
          <Link to='dashboard' className="px-3 py-1 font-medium transition-colors rounded hover:bg-gray-700">จัดการปัญหา (ฝั่งไอที)</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<CreateTicket />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
