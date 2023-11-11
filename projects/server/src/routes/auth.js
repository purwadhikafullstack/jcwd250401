const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const registerValidator = require("../middleware/validation/register");
const passwordValidator = require("../middleware/validation/password");

//auth

//register
router.post("/register", registerValidator.registerValidationRules,
registerValidator.applyRegisterValidation, authController.handleRegister);
router.post("/adminregister", registerValidator.registerValidationRules,
registerValidator.applyRegisterValidation, authController.handleAdminRegister);
router.post("/registergoogle", authController.handleRegisterWithGoogle);

//verify
router.post("/sendverify", authController.handleSendVerifyEmail);
router.get("/verify",  authController.handleVerify);

//create password
router.post("/password", 
passwordValidator.passwordValidationRules,
passwordValidator.applyPasswordValidation,
authController.handleCreatePassword)

//login 
router.post("/", authController.handleLogin);
router.post("/google", authController.handleLoginWithGoogle)
router.post("/admin", authController.handleAdminLogin);

//forgot password
router.post("/forgotpassword", authController.handleForgotPassword)
router.post("/resetpassword", passwordValidator.passwordValidationRules,
passwordValidator.applyPasswordValidation, authController.handleResetPassword)


module.exports = router;
