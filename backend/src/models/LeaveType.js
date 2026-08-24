const mongoose = require("mongoose");

const leaveTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Leave type name is required"],
      unique: true,
      enum: {
        values: ["Casual", "Sick", "Earned", "CompOff"],
        message: "Leave type must be Casual, Sick, Earned, or CompOff",
      },
    },
    maxDaysPerYear: {
      type: Number,
      required: [true, "Maximum days per year is required"],
      min: [1, "Maximum days per year must be at least 1"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("LeaveType", leaveTypeSchema);
