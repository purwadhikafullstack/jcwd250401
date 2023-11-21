const express = require("express");
const router = express.Router();

const userController = require("../controller/user");
const authController = require("../controller/auth")

router.get("/", userController.getAllUser);
router.get("/admin", userController.getAllAdmin);
router.patch("/admin/:id", userController.updateAdmin);
router.delete("/admin/:id", userController.deleteAdmin);
router.post("/", authController.handleAdminRegister)

module.exports = router;
