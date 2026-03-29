const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, bookingController.createBooking);
router.get("/", verifyToken, requireAdmin, bookingController.getBookings);
router.get("/my", verifyToken, bookingController.getMyBookings);
router.patch("/:id/cancel", verifyToken, bookingController.cancelBooking);

module.exports = router;