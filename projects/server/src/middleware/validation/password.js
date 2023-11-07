const { body, validationResult } = require("express-validator");

exports.passwordValidationRules = [
  body("password")
    .notEmpty()
    .isStrongPassword({
      minSymbols: 1,
      minNumbers: 1,
    })
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be at least 6-20 characters, contain at least one symbol, one number, and one uppercase letter")
    .custom((value, { req }) => {
      const errors = [];

      if (value.length < 6) {
        errors.push("Password must be at least 6 characters");
      }

      if (value.length > 20) {
        errors.push("Password cannot exceed 20 characters");
      }

      const symbolCount = (value.match(/[$&+,:;=?@#|'<>.^*()%!-]/g) || []).length;
      if (symbolCount < 1) {
        errors.push("Password must contain at least one symbol");
      }

      const numberCount = (value.match(/\d/g) || []).length;
      if (numberCount < 1) {
        errors.push("Password must contain at least one number");
      }

      if (value === value.toLowerCase()) {
        errors.push("Password must contain at least one uppercase letter");
      }

      if (errors.length > 0) {
        throw errors;
      }

      return true;
    }),
];

exports.applyPasswordValidation = [
  (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json({
        ok: false,
        message: "Failed data validation",
        errors: result.array(),
      });
      return;
    }
    next();
  },
];