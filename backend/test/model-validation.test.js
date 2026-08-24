const test = require("node:test");
const assert = require("node:assert/strict");
const mongoose = require("mongoose");
const Employee = require("../src/models/Employee");
const LeaveType = require("../src/models/LeaveType");
const LeaveRequest = require("../src/models/LeaveRequest");

test("Employee rejects missing required fields and a negative leave balance", () => {
  const employee = new Employee({ leaveBalance: -1, role: "employee" });
  const error = employee.validateSync();

  assert.ok(error.errors.name);
  assert.ok(error.errors.email);
  assert.ok(error.errors.department);
  assert.ok(error.errors.designation);
  assert.ok(error.errors.passwordHash);
  assert.match(error.errors.leaveBalance.message, /cannot be negative/i);
});

test("LeaveType accepts only the four required names", () => {
  const leaveType = new LeaveType({ name: "Holiday", maxDaysPerYear: 5 });
  const error = leaveType.validateSync();

  assert.match(error.errors.name.message, /Casual, Sick, Earned, or CompOff/);
});

test("LeaveRequest validates minimum days, status, and date order", () => {
  const leave = new LeaveRequest({
    employeeId: new mongoose.Types.ObjectId(),
    leaveTypeId: new mongoose.Types.ObjectId(),
    fromDate: new Date("2026-08-25T00:00:00.000Z"),
    toDate: new Date("2026-08-24T00:00:00.000Z"),
    days: 0,
    reason: "Exam validation demonstration",
    status: "unknown",
  });
  const error = leave.validateSync();

  assert.match(error.errors.days.message, /at least one day/i);
  assert.match(error.errors.status.message, /pending, approved, rejected, or cancelled/i);
  assert.match(error.errors.toDate.message, /on or after from date/i);
});
