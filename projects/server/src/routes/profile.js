const express = require("express");
const router = express.Router();

const { multerUpload } = require("../lib/multer");
const profileController = require("../controller/profile");

router.patch("/:id", multerUpload.single("photoProfile"), profileController.handleUpdateProfile);
router.get("/:id", profileController.handleGetSingleUser);
router.patch("/password/:id", profileController.handleUpdatePassword);

module.exports = router;
