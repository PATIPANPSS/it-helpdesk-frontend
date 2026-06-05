import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CreateTicket from "./components/CreateTicket";
import ProtectedRoute from "./ProtectedRoute";
import MyTickets from "./components/MyTickets";
import AdminUsers from "./components/AdminUsers";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");

    if (token) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }
  }, []);

  const handleLoginSuccess = () => {
    const currentRole = localStorage.getItem("role");
    setIsAuthenticated(true);
    setRole(currentRole);

    if (currentRole === "admin" || currentRole === "it_support") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/ticket";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole(null);
    window.location.href = "/login";
  };

  return (
    <BrowserRouter>
      {isAuthenticated && (
        <nav className="p-4 bg-gray-800 text-white shadow-md">
          <div className="flex items-center justify-between mx-auto max-w-7xl">
            <div className="flex items-center gap-6">
              <h1 className="mr-4 text-xl font-bold text-blue-400">
                IT Helpdesk
              </h1>

              {(role === "user" || role === "admin") && (
                <>
                  <Link
                    to="/ticket"
                    className="px-3 py-1 font-medium transition-colors rounded hover:bg-gray-700"
                  >
                    แจ้งซ่อม
                  </Link>
                  <Link
                    to="/my-tickets"
                    className="px-3 py-1 font-medium transition-colors rounded hover:bg-gray-700"
                  >
                    ประวัติของฉัน
                  </Link>
                </>
              )}

              {(role === "it_support" || role === "admin") && (
                <Link
                  to="/dashboard"
                  className="px-3 py-1 font-medium transition-colors rounded hover:bg-gray-700"
                >
                  รับเรื่อง
                </Link>
              )}

              {role === "admin" && (
                <Link
                  to="/admin/users"
                  className="px-3 py-1 font-medium text-yellow-400 transition-colors border border-yellow-400 rounded hover:bg-yellow-400 hover:text-gray-900"
                >
                  จัดการผู้ใช้งาน
                </Link>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-1 text-sm font-medium text-white bg-red-500 rounded transition-colors hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </nav>
      )}

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              role === "admin" || role === "it_support" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/ticket" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? (
              role === "admin" || role === "it_support" ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/ticket" replace />
              )
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        <Route
          path="/ticket"
          element={
            isAuthenticated ? (
              <CreateTicket />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-tickets"
          element={
            isAuthenticated ? <MyTickets /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/admin/users"
          element={
            isAuthenticated && role === "admin" ? (
              <AdminUsers />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
