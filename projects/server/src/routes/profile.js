const express = require("express");
const router = express.Router();

const { multerUpload } = require("../lib/multer");
const profileController = require("../controller/profile");
const authMiddleware = require("../middleware/auth");

router.patch("/:username", authMiddleware.validateToken, multerUpload.single("photoProfile"), profileController.handleUpdateProfile);
router.get("/:username", authMiddleware.validateToken, profileController.handleGetSingleUser);
router.patch("/password/:username", authMiddleware.validateToken, profileController.handleUpdatePassword);
router.get("/admin/:username", profileController.handleGetSingleAdmin);

module.exports = router;
