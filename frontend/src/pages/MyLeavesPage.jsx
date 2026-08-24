import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import LeaveRequestCard from "../components/LeaveRequestCard";
import { useAuth } from "../context/AuthContext";

const filters = ["All", "Pending", "Approved", "Rejected"];

function MyLeavesPage() {
  const { employee, token } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    let isCurrent = true;

    async function loadLeaves() {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest("/leaves/my", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (isCurrent) {
          setLeaves(data.leaves);
        }
      } catch (requestError) {
        if (isCurrent) {
          setError("Failed to load your leave history.");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    }

    loadLeaves();

    return () => {
      isCurrent = false;
    };
  }, [token]);

  const filteredLeaves = leaves.filter(
    (leave) => filter === "All" || leave.status === filter.toLowerCase(),
  );

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Personal history</p>
          <h1>Welcome, {employee?.name}</h1>
          <p>Review your submitted requests and their latest status.</p>
        </div>

        <label className="filter-control">
          Status filter
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            {filters.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && <p className="state-message">Loading your leave history…</p>}
      {!loading && error && <p className="alert alert-error">{error}</p>}

      {!loading && !error && filteredLeaves.length === 0 && (
        <div className="empty-state">
          <h2>No leave requests found</h2>
          <p>{filter === "All" ? "Your submitted requests will appear here." : `No ${filter.toLowerCase()} requests.`}</p>
        </div>
      )}

      {!loading && !error && filteredLeaves.length > 0 && (
        <div className="card-grid">
          {filteredLeaves.map((leave) => (
            <LeaveRequestCard
              key={leave._id}
              fromDate={leave.fromDate}
              toDate={leave.toDate}
              days={leave.days}
              leaveType={leave.leaveTypeId?.name}
              reason={leave.reason}
              status={leave.status}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default MyLeavesPage;
