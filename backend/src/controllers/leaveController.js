const Employee = require("../models/Employee");
const LeaveRequest = require("../models/LeaveRequest");
const LeaveType = require("../models/LeaveType");
const AppError = require("../utils/AppError");

const ALLOWED_STATUSES = ["approved", "rejected"];
const FILTER_STATUSES = ["pending", "approved", "rejected", "cancelled"];

function parseDateOnly(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function countInclusiveDays(fromDate, toDate) {
  return Math.floor((toDate.getTime() - fromDate.getTime()) / 86_400_000) + 1;
}

async function applyForLeave(req, res, next) {
  let balanceDeducted = false;
  let days = 0;

  try {
    const { leaveTypeId, fromDate, toDate, reason } = req.body;

    if (!leaveTypeId || !fromDate || !toDate || !reason?.trim()) {
      throw new AppError("Leave type, from date, to date, and reason are required.", 400);
    }

    const start = parseDateOnly(fromDate);
    const end = parseDateOnly(toDate);

    if (!start || !end) {
      throw new AppError("Dates must use the YYYY-MM-DD format.", 400);
    }

    days = countInclusiveDays(start, end);

    if (days < 1) {
      throw new AppError("To date must be on or after from date.", 400);
    }

    const leaveType = await LeaveType.findById(leaveTypeId);

    if (!leaveType) {
      throw new AppError("Selected leave type does not exist.", 400);
    }

    if (days > leaveType.maxDaysPerYear) {
      throw new AppError(
        `${leaveType.name} leave is limited to ${leaveType.maxDaysPerYear} days per year.`,
        400,
      );
    }

    const employee = await Employee.findOneAndUpdate(
      { _id: req.employee.id, leaveBalance: { $gte: days } },
      { $inc: { leaveBalance: -days } },
      { new: true, runValidators: true },
    );

    if (!employee) {
      throw new AppError("Requested days exceed the employee's remaining leave balance.", 400);
    }

    balanceDeducted = true;

    const leave = await LeaveRequest.create({
      employeeId: employee.id,
      leaveTypeId,
      fromDate: start,
      toDate: end,
      days,
      reason: reason.trim(),
    });

    await leave.populate("leaveTypeId", "name maxDaysPerYear");

    res.status(201).json({
      success: true,
      message: "Leave request created successfully.",
      leave,
      remainingBalance: employee.leaveBalance,
    });
  } catch (error) {
    if (balanceDeducted) {
      await Employee.findByIdAndUpdate(req.employee.id, { $inc: { leaveBalance: days } }).catch(() => {});
    }
    next(error);
  }
}

async function getMyLeaves(req, res, next) {
  try {
    const leaves = await LeaveRequest.find({ employeeId: req.employee.id })
      .populate("leaveTypeId", "name maxDaysPerYear")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, leaves });
  } catch (error) {
    next(error);
  }
}

async function getAllLeaves(req, res, next) {
  try {
    const query = {};

    if (req.query.status) {
      if (!FILTER_STATUSES.includes(req.query.status)) {
        throw new AppError("Invalid status filter.", 400);
      }
      query.status = req.query.status;
    }

    const leaves = await LeaveRequest.find(query)
      .populate("employeeId", "name email department designation")
      .populate("leaveTypeId", "name maxDaysPerYear")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, leaves });
  } catch (error) {
    next(error);
  }
}

async function updateLeaveStatus(req, res, next) {
  try {
    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      throw new AppError("Status must be either approved or rejected.", 400);
    }

    const leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      throw new AppError("Leave request not found.", 400);
    }

    if (leave.status !== "pending") {
      throw new AppError("Only pending leave requests can be approved or rejected.", 400);
    }

    leave.status = status;
    await leave.save();

    if (status === "rejected") {
      await Employee.findByIdAndUpdate(leave.employeeId, { $inc: { leaveBalance: leave.days } });
    }

    await leave.populate([
      { path: "employeeId", select: "name email department designation" },
      { path: "leaveTypeId", select: "name maxDaysPerYear" },
    ]);

    res.status(200).json({
      success: true,
      message: `Leave request ${status}.`,
      leave,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  applyForLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
};
