const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = require("../src/app");
const connectDB = require("../src/config/db");

function assertStatus(label, response, expected) {
  if (response.status !== expected) {
    throw new Error(`${label}: expected HTTP ${expected}, received ${response.status}`);
  }
  console.log(`PASS ${label}: HTTP ${response.status}`);
}

async function jsonRequest(baseUrl, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  const body = await response.json();
  return { response, body };
}

async function verifyApi() {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error("MONGO_URI and JWT_SECRET are required in backend/.env.");
  }

  await connectDB();
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}/api/v1`;

  try {
    const loginEmployee = await jsonRequest(baseUrl, "/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "employee@example.com", password: "Password123!" }),
    });
    assertStatus("employee login", loginEmployee.response, 200);
    const employeeToken = loginEmployee.body.token;

    const leaveTypesResult = await jsonRequest(baseUrl, "/leave-types");
    assertStatus("public leave types", leaveTypesResult.response, 200);
    const casualType = leaveTypesResult.body.leaveTypes.find((item) => item.name === "Casual");
    const earnedType = leaveTypesResult.body.leaveTypes.find((item) => item.name === "Earned");

    if (!casualType || !earnedType) {
      throw new Error("Seeded Casual and Earned leave types were not found.");
    }

    const unauthorized = await jsonRequest(baseUrl, "/leaves/my");
    assertStatus("missing Bearer token", unauthorized.response, 401);

    const approvedCandidate = await jsonRequest(baseUrl, "/leaves", {
      method: "POST",
      headers: { Authorization: `Bearer ${employeeToken}` },
      body: JSON.stringify({
        leaveTypeId: casualType._id,
        fromDate: "2026-09-10",
        toDate: "2026-09-10",
        reason: "Medical appointment",
      }),
    });
    assertStatus("create one-day leave", approvedCandidate.response, 201);

    const pendingCandidate = await jsonRequest(baseUrl, "/leaves", {
      method: "POST",
      headers: { Authorization: `Bearer ${employeeToken}` },
      body: JSON.stringify({
        leaveTypeId: casualType._id,
        fromDate: "2026-09-14",
        toDate: "2026-09-15",
        reason: "Family function",
      }),
    });
    assertStatus("create two-day leave", pendingCandidate.response, 201);

    const myLeaves = await jsonRequest(baseUrl, "/leaves/my", {
      headers: { Authorization: `Bearer ${employeeToken}` },
    });
    assertStatus("employee leave history", myLeaves.response, 200);

    if (!myLeaves.body.leaves.every((leave) => leave.leaveTypeId?.name)) {
      throw new Error("GET /leaves/my did not populate leaveTypeId.name.");
    }
    console.log("PASS leave type population is present");

    const tooManyDays = await jsonRequest(baseUrl, "/leaves", {
      method: "POST",
      headers: { Authorization: `Bearer ${employeeToken}` },
      body: JSON.stringify({
        leaveTypeId: earnedType._id,
        fromDate: "2026-10-01",
        toDate: "2026-10-20",
        reason: "This request intentionally exceeds the remaining balance",
      }),
    });
    assertStatus("leave balance validation", tooManyDays.response, 400);

    const loginHr = await jsonRequest(baseUrl, "/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "hr@example.com", password: "Password123!" }),
    });
    assertStatus("HR login", loginHr.response, 200);
    const hrToken = loginHr.body.token;

    const approved = await jsonRequest(
      baseUrl,
      `/leaves/${approvedCandidate.body.leave._id}/status`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${hrToken}` },
        body: JSON.stringify({ status: "approved" }),
      },
    );
    assertStatus("HR approves request", approved.response, 200);

    const invalidStatus = await jsonRequest(
      baseUrl,
      `/leaves/${pendingCandidate.body.leave._id}/status`,
      {
        method: "PATCH",
        headers: { Authorization: `Bearer ${hrToken}` },
        body: JSON.stringify({ status: "cancelled" }),
      },
    );
    assertStatus("invalid status validation", invalidStatus.response, 400);

    const allLeaves = await jsonRequest(baseUrl, "/leaves", {
      headers: { Authorization: `Bearer ${hrToken}` },
    });
    assertStatus("HR lists all requests", allLeaves.response, 200);

    console.log(
      `API verification complete. Database contains ${allLeaves.body.leaves.length} leave request(s).`,
    );
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    await mongoose.disconnect();
  }
}

verifyApi().catch(async (error) => {
  console.error(`API verification failed: ${error.message}`);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
