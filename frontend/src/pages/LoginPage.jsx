import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";
import { getRoleHome } from "../roleRoutes";

const demoAccounts = [
  {
    role: "Employee",
    email: "employee@example.com",
    password: "Password123!",
    description: "Apply for leave and view personal history",
  },
  {
    role: "Manager",
    email: "manager@example.com",
    password: "Password123!",
    description: "Review and decide employee requests",
  },
  {
    role: "HR",
    email: "hr@example.com",
    password: "Password123!",
    description: "Manage all requests and export reports",
  },
];

function LoginPage() {
  const { login, role, token } = useAuth();
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: "employee@example.com",
    password: "Password123!",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (token) {
    return <Navigate to={getRoleHome(role)} replace />;
  }

  function selectDemoAccount(account) {
    setCredentials({ email: account.email, password: account.password });
    setError("");
  }

  function handleChange(event) {
    setCredentials((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      login(data);
      navigate(getRoleHome(data.role), { replace: true });
    } catch (requestError) {
      setError(requestError.message || "Unable to sign in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="login-layout">
      <div className="hero-copy">
        <p className="eyebrow">Employee self-service</p>
        <h1>Leave requests without the WhatsApp confusion.</h1>
        <p>
          Apply for time off, track every decision, and keep balances accurate in one simple portal.
        </p>
        <div className="hero-points">
          <span>Fast applications</span>
          <span>Clear status history</span>
          <span>Role-based access</span>
        </div>
      </div>

      <div className="panel login-panel">
        <p className="eyebrow">Welcome back</p>
        <h2>Sign in to continue</h2>
        <p className="muted">Use your TechSolutions employee account.</p>

        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Email
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <span className="password-control">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
              <button type="button" onClick={() => setShowPassword((current) => !current)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </span>
          </label>

          {error && <p className="alert alert-error">{error}</p>}

          <button type="submit" className="button button-primary" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="demo-accounts">
          <div className="demo-heading">
            <strong>Demo accounts</strong>
            <span>Choose an account to fill the form</span>
          </div>
          {demoAccounts.map((account) => (
            <button
              type="button"
              className={`demo-account${credentials.email === account.email ? " selected" : ""}`}
              key={account.role}
              onClick={() => selectDemoAccount(account)}
            >
              <span className="demo-role">{account.role}</span>
              <span className="demo-description">{account.description}</span>
              <span className="demo-credentials">
                <code>{account.email}</code>
                <code>{account.password}</code>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
