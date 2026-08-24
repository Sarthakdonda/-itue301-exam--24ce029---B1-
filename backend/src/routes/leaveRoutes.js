const express = require("express");
const {
  applyForLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");
const { authGuard, requireRole } = require("../middleware/authGuard");

const router = express.Router();

router.use(authGuard);

router.post("/", applyForLeave);
router.get("/my", getMyLeaves);
router.get("/", requireRole("manager", "hr"), getAllLeaves);
router.patch("/:id/status", requireRole("manager", "hr"), updateLeaveStatus);

module.exports = router;
