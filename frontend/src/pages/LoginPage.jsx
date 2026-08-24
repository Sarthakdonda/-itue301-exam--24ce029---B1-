import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login, role, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({
    email: "employee@example.com",
    password: "Password123!",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (token) {
    return <Navigate to={role === "hr" ? "/hr" : "/my-leaves"} replace />;
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
      navigate(location.state?.from || (data.role === "hr" ? "/hr" : "/my-leaves"), {
        replace: true,
      });
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
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </label>

          {error && <p className="alert alert-error">{error}</p>}

          <button type="submit" className="button button-primary" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="demo-note">
          <strong>Demo users after seeding</strong>
          <span>Employee: employee@example.com</span>
          <span>HR: hr@example.com</span>
          <span>Password: Password123!</span>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
