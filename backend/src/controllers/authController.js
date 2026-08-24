const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const AppError = require("../utils/AppError");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError("Email and password are required.", 400);
    }

    const employee = await Employee.findOne({ email: email.toLowerCase().trim() }).select("+passwordHash");

    if (!employee || !(await bcrypt.compare(password, employee.passwordHash))) {
      throw new AppError("Invalid email or password.", 401);
    }

    const token = jwt.sign(
      { id: employee.id, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" },
    );

    res.status(200).json({
      success: true,
      token,
      role: employee.role,
      employee: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        department: employee.department,
        designation: employee.designation,
        leaveBalance: employee.leaveBalance,
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { login };
