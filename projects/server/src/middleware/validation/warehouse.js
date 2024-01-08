const {body, validationResult} = require('express-validator');

exports.WarehouseValidationRules = [
    // form-data: name, street, city, province, warehouseImage

    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long'),

    body('street')
        .notEmpty()
        .withMessage('Street is required')
        .isLength({ min: 3 })
        .withMessage('Street must be at least 3 characters long'),

    body('city')
        .notEmpty()
        .withMessage('City is required')
        .isLength({ min: 3 })
        .withMessage('City must be at least 3 characters long'),

    body('cityId')
        .notEmpty()
        .withMessage('City ID is required')
        .isNumeric()
        .withMessage('City ID must be numeric'),

    body('province')
        .notEmpty()
        .withMessage('Province is required')
        .isLength({ min: 3 })
        .withMessage('Province must be at least 3 characters long'),

    body('provinceId')
        .notEmpty()
        .withMessage('Province ID is required')
        .isNumeric()
        .withMessage('Province ID must be numeric'),

    body('warehouseImage')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('Warehouse image is required');
            }
            return true;
        }),
    
    body('phoneNumber')
        .notEmpty()
        .withMessage('Phone number is required')
        .isLength({ min: 3 })
        .withMessage('Phone number must be at least 3 characters long'),
];

exports.applyWarehouseValidation = [(req, res, next) => {
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
