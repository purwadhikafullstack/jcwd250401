const { check } = require('express-validator')

exports.validateCategory = [
    check('name')
    .notEmpty().withMessage('Name category cannot be empty')
    .bail()
    .isString().withMessage('Name category must be a string')
]