const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Employee email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
      trim: true,
    },
    leaveBalance: {
      type: Number,
      default: 20,
      min: [0, "Leave balance cannot be negative"],
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: ["employee", "manager", "hr"],
        message: "Role must be employee, manager, or hr",
      },
      default: "employee",
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Employee", employeeSchema);
