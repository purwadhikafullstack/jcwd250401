const { body, validationResult } = require("express-validator");

exports.productValidationRules = [
  body("productName").isLength({ min: 5 }).withMessage("product name must be minimum 5 characters"),
  body("productDescription").isLength({ min: 15 }).withMessage("product description must be minimum 15 characters"),
];

exports.applyProductValidation = [
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
