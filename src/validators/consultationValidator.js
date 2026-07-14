const { body } = require('express-validator');

const createConsultationValidator = [
  body('doctorId').isInt().withMessage('Valid Doctor ID is required')
];

const updateConsultationStatusValidator = [
  body('status').isIn(['PENDING', 'ACTIVE', 'COMPLETED']).withMessage('Status must be PENDING, ACTIVE, or COMPLETED')
];

module.exports = {
  createConsultationValidator,
  updateConsultationStatusValidator
};
