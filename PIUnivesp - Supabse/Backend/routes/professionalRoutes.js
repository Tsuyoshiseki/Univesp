const express = require("express");
const router = express.Router();
const professionalController = require("../controllers/professionalController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

router.get("/", professionalController.getProfessionals);
router.post("/", verifyToken, requireAdmin, professionalController.createProfessional);
router.delete("/:id", verifyToken, requireAdmin, professionalController.deleteProfessional);

module.exports = router;