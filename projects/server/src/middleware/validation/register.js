const { body, validationResult } = require("express-validator");

exports.registerValidationRules = [body("email").isEmail().withMessage("email must be valid")];

exports.applyRegisterValidation = [
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      //ini validasi gagal
      res.status(400).json({
        ok: false,
        message: "failed data validation",
        errors: result.errors,
      });
      return;
    }
    next();
  },
];
