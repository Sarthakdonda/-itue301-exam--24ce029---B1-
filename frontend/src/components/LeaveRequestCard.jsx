const statusColors = {
  pending: "#f4b400",
  approved: "#1e9b50",
  rejected: "#dc3545",
  cancelled: "#6b7280",
};

function formatDate(date) {
  if (!date) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function LeaveRequestCard({ fromDate, toDate, days, leaveType, reason, status }) {
  const normalizedStatus = status?.toLowerCase() || "pending";

  return (
    <article className="leave-card">
      <div className="leave-card-heading">
        <div>
          <p className="eyebrow">{leaveType || "Leave"}</p>
          <h2>
            {days} {days === 1 ? "day" : "days"}
          </h2>
        </div>
        <span
          className="status-pill"
          style={{ backgroundColor: statusColors[normalizedStatus] || statusColors.cancelled }}
        >
          {normalizedStatus}
        </span>
      </div>

      <dl className="leave-details">
        <div>
          <dt>From</dt>
          <dd>{formatDate(fromDate)}</dd>
        </div>
        <div>
          <dt>To</dt>
          <dd>{formatDate(toDate)}</dd>
        </div>
        <div className="reason-row">
          <dt>Reason</dt>
          <dd>{reason}</dd>
        </div>
      </dl>
    </article>
  );
}

export default LeaveRequestCard;
