const { body } = require('express-validator');

const registerValidator = [
  body('name').notEmpty().withMessage('Name is required').isString(),
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').isIn(['PATIENT', 'DOCTOR']).withMessage('Role must be PATIENT or DOCTOR'),
  body('specialization').if(body('role').equals('DOCTOR')).notEmpty().withMessage('Specialization is required for doctors'),
  body('yearsOfExperience').if(body('role').equals('DOCTOR')).isInt({ min: 0 }).withMessage('Years of experience must be a valid number')
];

const loginValidator = [
  body('email').isEmail().withMessage('Must be a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

module.exports = {
  registerValidator,
  loginValidator
};
