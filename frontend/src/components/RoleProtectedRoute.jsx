import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

function RoleProtectedRoute({ requiredRole, children }) {
  const { role } = useAuth();

  return (
    <ProtectedRoute>
      {role === requiredRole ? children : <Navigate to="/my-leaves" replace />}
    </ProtectedRoute>
  );
}

export default RoleProtectedRoute;
