const express = require("express");
const router = express.Router();

const { multerUpload } = require("../lib/multer");
const profileController = require("../controller/profile");
const authMiddleware = require("../middleware/auth");

router.patch("/:username", multerUpload.single("photoProfile"), profileController.handleUpdateProfile);
router.get("/:username", profileController.handleGetSingleUser);
router.patch("/password/:username", profileController.handleUpdatePassword);

module.exports = router;
