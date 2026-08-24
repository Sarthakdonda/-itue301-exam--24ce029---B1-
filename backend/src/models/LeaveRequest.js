const mongoose = require("mongoose");

const leaveRequestSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: [true, "Employee is required"],
    },
    leaveTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LeaveType",
      required: [true, "Leave type is required"],
    },
    fromDate: {
      type: Date,
      required: [true, "From date is required"],
    },
    toDate: {
      type: Date,
      required: [true, "To date is required"],
      validate: {
        validator(value) {
          return !this.fromDate || value >= this.fromDate;
        },
        message: "To date must be on or after from date",
      },
    },
    days: {
      type: Number,
      required: [true, "Number of days is required"],
      min: [1, "Leave must be at least one day"],
    },
    reason: {
      type: String,
      required: [true, "Reason is required"],
      trim: true,
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "approved", "rejected", "cancelled"],
        message: "Status must be pending, approved, rejected, or cancelled",
      },
      default: "pending",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("LeaveRequest", leaveRequestSchema);
