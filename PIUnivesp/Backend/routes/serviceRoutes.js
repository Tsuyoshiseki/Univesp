const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

router.get("/", serviceController.getServices);
router.post("/", verifyToken, requireAdmin, serviceController.createService);
router.delete("/:id", verifyToken, requireAdmin, serviceController.deleteService);

module.exports = router;