const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const registerValidator = require("../middleware/validation/register");
const passwordValidator = require("../middleware/validation/password");

router.post("/register", registerValidator.registerValidationRules,
registerValidator.applyRegisterValidation, authController.handleRegister);

router.post("/sendverify", authController.handleSendVerifyEmail);

router.post("/registergoogle", authController.handleRegisterWithGoogle);

router.get("/verify",  authController.handleVerify);


router.post("/password", 
passwordValidator.passwordValidationRules,
passwordValidator.applyPasswordValidation,
authController.handleCreatePassword)

router.post("/", authController.handleLogin);
router.post("/google", authController.handleLoginWithGoogle)  // login with google;
router.post("/forgotpassword", authController.handleForgotPassword)
router.post("/resetpassword", passwordValidator.passwordValidationRules,
passwordValidator.applyPasswordValidation, authController.handleResetPassword)


module.exports = router;
