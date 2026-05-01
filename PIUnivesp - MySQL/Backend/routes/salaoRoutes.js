const express = require("express");
const router = express.Router();
const salaoController = require("../controllers/salaoController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

router.get("/", salaoController.getSalons);
router.post("/", verifyToken, requireAdmin, salaoController.createSalon);
router.delete("/:id", verifyToken, requireAdmin, salaoController.deleteSalon);

module.exports = router;