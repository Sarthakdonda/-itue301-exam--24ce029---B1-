const cors = require("cors");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const leaveTypeRoutes = require("./routes/leaveTypeRoutes");
const leaveRoutes = require("./routes/leaveRoutes");
const requestLogger = require("./middleware/requestLogger");
const errorHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");

const app = express();

app.use(requestLogger);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  }),
);
app.use(express.json({ limit: "20kb" }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/leave-types", leaveTypeRoutes);
app.use("/api/v1/leaves", leaveRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;
