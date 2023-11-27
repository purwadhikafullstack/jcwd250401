const express = require("express");
const router = express.Router();

const userController = require("../controller/user");
const authController = require("../controller/auth");
const authMiddleware = require("../middleware/auth");
const registerValidator = require("../middleware/validation/register");

router.get("/", authMiddleware.validateToken, authMiddleware.checkRoleSuperAdmin, userController.getAllUser);
router.get("/admin", authMiddleware.validateToken, authMiddleware.checkRoleSuperAdmin, userController.getAllAdmin);
router.get("/admin/:username/:email", authMiddleware.validateToken, userController.getSingleAdminWarehouse);
router.patch("/admin/:id", authMiddleware.validateToken, authMiddleware.checkRoleSuperAdmin, userController.updateAdmin);
router.delete("/admin/:id", authMiddleware.validateToken, authMiddleware.checkRoleSuperAdmin, userController.deleteAdmin);
router.post("/admin", authMiddleware.validateToken, authMiddleware.checkRoleSuperAdmin, registerValidator.registerValidationRules, registerValidator.applyRegisterValidation, authController.handleAdminRegister);

module.exports = router;
