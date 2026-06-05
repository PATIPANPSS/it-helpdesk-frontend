import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem("role");

  if(!token){
    return <Navigate to='/login' replace />;
  }

  if (role !== "admin" && role !== 'it_support') {
    return <Navigate to="/ticket" replace />;
  }
  return children;
}

export default ProtectedRoute;
