import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleHome } from "../roleRoutes";
import ProtectedRoute from "./ProtectedRoute";

function RoleProtectedRoute({ requiredRole, children }) {
  const { role } = useAuth();

  return (
    <ProtectedRoute>
      {role === requiredRole ? children : <Navigate to={getRoleHome(role)} replace />}
    </ProtectedRoute>
  );
}

export default RoleProtectedRoute;
