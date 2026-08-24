const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const AppError = require("../utils/AppError");

async function authGuard(req, res, next) {
  try {
    const authorization = req.get("Authorization") || "";

    if (!authorization.startsWith("Bearer ")) {
      throw new AppError("Authentication required. Send a Bearer token.", 401);
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      throw new AppError("Authentication required. Send a Bearer token.", 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const employee = await Employee.findById(decoded.id).select("name email department designation role leaveBalance");

    if (!employee) {
      throw new AppError("The account for this token no longer exists.", 401);
    }

    req.employee = employee;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError("Invalid or expired token.", 401));
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.employee || !allowedRoles.includes(req.employee.role)) {
      return next(new AppError("You do not have permission to perform this action.", 401));
    }

    return next();
  };
}

module.exports = { authGuard, requireRole };
