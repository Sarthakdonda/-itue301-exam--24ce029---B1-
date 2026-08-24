const LeaveType = require("../models/LeaveType");

async function getLeaveTypes(req, res, next) {
  try {
    const leaveTypes = await LeaveType.find().sort({ name: 1 });
    res.status(200).json({ success: true, leaveTypes });
  } catch (error) {
    next(error);
  }
}

module.exports = { getLeaveTypes };
