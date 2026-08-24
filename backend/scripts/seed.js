const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDB = require("../src/config/db");
const Employee = require("../src/models/Employee");
const LeaveType = require("../src/models/LeaveType");

dotenv.config();

const leaveTypes = [
  { name: "Casual", maxDaysPerYear: 12 },
  { name: "Sick", maxDaysPerYear: 10 },
  { name: "Earned", maxDaysPerYear: 20 },
  { name: "CompOff", maxDaysPerYear: 5 },
];

const employees = [
  {
    name: "Aarav Employee",
    email: "employee@example.com",
    department: "Engineering",
    designation: "Software Engineer",
    role: "employee",
  },
  {
    name: "Meera Manager",
    email: "manager@example.com",
    department: "Engineering",
    designation: "Engineering Manager",
    role: "manager",
  },
  {
    name: "Riya HR",
    email: "hr@example.com",
    department: "Human Resources",
    designation: "HR Executive",
    role: "hr",
  },
];

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required in backend/.env before seeding.");
  }

  await connectDB();
  const passwordHash = await bcrypt.hash(process.env.SEED_PASSWORD || "Password123!", 12);

  for (const leaveType of leaveTypes) {
    await LeaveType.findOneAndUpdate(
      { name: leaveType.name },
      leaveType,
      { upsert: true, new: true, runValidators: true },
    );
  }

  for (const employee of employees) {
    await Employee.findOneAndUpdate(
      { email: employee.email },
      {
        $set: { ...employee, passwordHash },
        $setOnInsert: { leaveBalance: 20 },
      },
      { upsert: true, new: true, runValidators: true },
    );
  }

  console.log("Seed complete: 4 leave types and 3 role-based demo accounts are ready.");
}

seed()
  .catch((error) => {
    console.error(`Seed failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
