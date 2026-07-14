const { body } = require('express-validator');

const sendMessageValidator = [
  body('message').notEmpty().withMessage('Message content is required').isString()
];

module.exports = {
  sendMessageValidator
};
