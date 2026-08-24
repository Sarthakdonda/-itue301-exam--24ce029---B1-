import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [employee, setEmployee] = useState(null);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");

  function login(authData) {
    setEmployee(authData.employee);
    setToken(authData.token);
    setRole(authData.role);
  }

  function logout() {
    setEmployee(null);
    setToken("");
    setRole("");
  }

  const value = useMemo(
    () => ({ employee, token, role, login, logout }),
    [employee, token, role],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
