import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleHome } from "../roleRoutes";

function Navigation() {
  const { employee, role, token, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="site-header">
      <NavLink to={token ? getRoleHome(role) : "/"} className="brand" aria-label="Leave Management home">
        <span className="brand-mark">LM</span>
        <span>
          <strong>Leave Management</strong>
          <small>TechSolutions Pvt Ltd</small>
        </span>
      </NavLink>

      <nav aria-label="Primary navigation">
        {!token && <NavLink to="/">Login</NavLink>}
        {role === "employee" && (
          <>
            <NavLink to="/apply">Apply Leave</NavLink>
            <NavLink to="/my-leaves">My Leaves</NavLink>
          </>
        )}
        {role === "hr" && <NavLink to="/hr">HR Panel</NavLink>}
        {role === "manager" && <NavLink to="/manager">Review Requests</NavLink>}
      </nav>

      <div className="account-area">
        {token ? (
          <>
            <span>
              {employee?.name} <small>({role})</small>
            </span>
            <button type="button" className="button button-secondary button-small" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <span className="signed-out">Not signed in</span>
        )}
      </div>
    </header>
  );
}

export default Navigation;
