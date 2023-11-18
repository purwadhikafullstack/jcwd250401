const {body, validationResult} = require('express-validator');

exports.addWarehouseValidationRules = [
    body('name')
        .isLength({min: 3})
        .withMessage('name must be at least 3 characters'),
    body('street')
        .isLength({min: 3})
        .withMessage('street must be at least 3 characters'),
    body('city')
        .isLength({min: 3})
        .withMessage('city must be at least 3 characters'),
    body('province')
        .isLength({min: 3})
        .withMessage('province must be at least 3 characters'),
];

exports.applyAddWarehouseValidation = [(req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        // ini validasi gagal
        res.status(400).json({
            ok: false,
            message: 'failed data validation',
            errors: result.errors,
        });
        return;
    }
    next();
}];
