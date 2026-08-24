import { useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  leaveTypeId: "",
  fromDate: "",
  toDate: "",
  reason: "",
};

function calculateDays(fromDate, toDate) {
  if (!fromDate || !toDate) return 0;

  const start = new Date(`${fromDate}T00:00:00Z`);
  const end = new Date(`${toDate}T00:00:00Z`);
  const result = Math.floor((end - start) / 86_400_000) + 1;
  return result > 0 ? result : 0;
}

function ApplyLeavePage() {
  const { employee, token } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [computedDays, setComputedDays] = useState(0);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLeaveTypes() {
      try {
        const data = await apiRequest("/leave-types");
        setLeaveTypes(data.leaveTypes);
      } catch (requestError) {
        setError("Failed to load leave types.");
      } finally {
        setLoadingTypes(false);
      }
    }

    loadLeaveTypes();
  }, []);

  useEffect(() => {
    setComputedDays(calculateDays(form.fromDate, form.toDate));
  }, [form.fromDate, form.toDate]);

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const data = await apiRequest("/leaves", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });

      setMessage(
        `Leave request submitted. Your remaining balance is ${data.remainingBalance} days.`,
      );
      setForm(emptyForm);
      setComputedDays(0);
    } catch (requestError) {
      setError(requestError.message || "Unable to submit the leave request.");
    } finally {
      setSubmitting(false);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">New request</p>
          <h1>Apply for leave</h1>
          <p>Plan your absence and send it for review.</p>
        </div>
        <div className="balance-card">
          <span>Current balance</span>
          <strong>{employee?.leaveBalance ?? "—"}</strong>
          <small>days before this request</small>
        </div>
      </div>

      <div className="panel form-panel">
        <form onSubmit={handleSubmit} className="leave-form">
          <label className="full-width">
            Leave type
            <select
              name="leaveTypeId"
              value={form.leaveTypeId}
              onChange={handleChange}
              required
              disabled={loadingTypes}
            >
              <option value="">{loadingTypes ? "Loading leave types…" : "Select a leave type"}</option>
              {leaveTypes.map((leaveType) => (
                <option key={leaveType._id} value={leaveType._id}>
                  {leaveType.name} (maximum {leaveType.maxDaysPerYear} days/year)
                </option>
              ))}
            </select>
          </label>

          <label>
            From date
            <input
              type="date"
              name="fromDate"
              value={form.fromDate}
              onChange={handleChange}
              min={today}
              required
            />
          </label>

          <label>
            To date
            <input
              type="date"
              name="toDate"
              value={form.toDate}
              onChange={handleChange}
              min={form.fromDate || today}
              required
            />
          </label>

          <div className="day-preview full-width">
            <span>Computed duration</span>
            <strong>{computedDays || 0} days</strong>
          </div>

          <label className="full-width">
            Reason
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows="5"
              maxLength="500"
              placeholder="Briefly explain why you need leave"
              required
            />
            <small>{form.reason.length}/500 characters</small>
          </label>

          {message && <p className="alert alert-success full-width">{message}</p>}
          {error && <p className="alert alert-error full-width">{error}</p>}

          <button
            type="submit"
            className="button button-primary full-width"
            disabled={submitting || loadingTypes || computedDays < 1}
          >
            {submitting ? "Submitting…" : "Submit leave request"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ApplyLeavePage;
