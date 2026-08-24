import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import ApplyLeavePage from "./pages/ApplyLeavePage";
import LoginPage from "./pages/LoginPage";
import MyLeavesPage from "./pages/MyLeavesPage";

const HRPanel = lazy(() => import("./pages/HRPanel"));

function App() {
  return (
    <div className="app-shell">
      <Navigation />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/apply"
            element={
              <ProtectedRoute>
                <ApplyLeavePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-leaves"
            element={
              <ProtectedRoute>
                <MyLeavesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr"
            element={
              <RoleProtectedRoute requiredRole="hr">
                <Suspense fallback={<p className="state-message">Loading HR panel…</p>}>
                  <HRPanel />
                </Suspense>
              </RoleProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
