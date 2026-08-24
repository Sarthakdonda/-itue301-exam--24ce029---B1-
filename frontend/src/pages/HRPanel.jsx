import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api";
import LeaveRequestCard from "../components/LeaveRequestCard";
import { useAuth } from "../context/AuthContext";

function escapeCsv(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function HRPanel() {
  const { token } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  async function loadLeaves() {
    setLoading(true);
    setError("");

    try {
      const data = await apiRequest("/leaves", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(data.leaves);
    } catch (requestError) {
      setError("Failed to load employee leave requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeaves();
  }, [token]);

  const counts = useMemo(
    () =>
      leaves.reduce(
        (summary, leave) => ({
          ...summary,
          [leave.status]: (summary[leave.status] || 0) + 1,
        }),
        { pending: 0, approved: 0, rejected: 0, cancelled: 0 },
      ),
    [leaves],
  );

  async function updateStatus(id, status) {
    setUpdatingId(id);
    setError("");

    try {
      const data = await apiRequest(`/leaves/${id}/status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setLeaves((current) => current.map((leave) => (leave._id === id ? data.leave : leave)));
    } catch (requestError) {
      setError(requestError.message || "Unable to update the request.");
    } finally {
      setUpdatingId("");
    }
  }

  function exportReport() {
    const rows = [
      ["Employee", "Email", "Department", "Leave type", "From", "To", "Days", "Reason", "Status"],
      ...leaves.map((leave) => [
        leave.employeeId?.name,
        leave.employeeId?.email,
        leave.employeeId?.department,
        leave.leaveTypeId?.name,
        new Date(leave.fromDate).toISOString().slice(0, 10),
        new Date(leave.toDate).toISOString().slice(0, 10),
        leave.days,
        leave.reason,
        leave.status,
      ]),
    ];
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "leave-report.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">HR workspace</p>
          <h1>Leave request overview</h1>
          <p>Review decisions and export a current leave report.</p>
        </div>
        <button type="button" className="button button-secondary" onClick={exportReport} disabled={!leaves.length}>
          Export CSV report
        </button>
      </div>

      <div className="summary-grid">
        {Object.entries(counts).map(([status, count]) => (
          <div className="summary-card" key={status}>
            <span>{status}</span>
            <strong>{count}</strong>
          </div>
        ))}
      </div>

      {loading && <p className="state-message">Loading all leave requests…</p>}
      {!loading && error && <p className="alert alert-error">{error}</p>}
      {!loading && !error && leaves.length === 0 && (
        <div className="empty-state">
          <h2>No requests to review</h2>
          <p>Employee leave applications will appear here.</p>
        </div>
      )}

      {!loading && leaves.length > 0 && (
        <div className="review-list">
          {leaves.map((leave) => (
            <div className="review-item" key={leave._id}>
              <div className="employee-line">
                <strong>{leave.employeeId?.name}</strong>
                <span>{leave.employeeId?.department}</span>
              </div>
              <LeaveRequestCard
                fromDate={leave.fromDate}
                toDate={leave.toDate}
                days={leave.days}
                leaveType={leave.leaveTypeId?.name}
                reason={leave.reason}
                status={leave.status}
              />
              {leave.status === "pending" && (
                <div className="review-actions">
                  <button
                    type="button"
                    className="button button-approve"
                    disabled={updatingId === leave._id}
                    onClick={() => updateStatus(leave._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="button button-reject"
                    disabled={updatingId === leave._id}
                    onClick={() => updateStatus(leave._id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default HRPanel;
