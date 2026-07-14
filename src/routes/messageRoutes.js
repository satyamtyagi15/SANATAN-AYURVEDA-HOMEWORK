const express = require('express');
const { sendMessage, getMessages } = require('../controllers/messageController');
const { sendMessageValidator } = require('../validators/messageValidator');
const validate = require('../middleware/validate');

// mergeParams is required because this router is mounted on another router with a dynamic parameter
const router = express.Router({ mergeParams: true });

router.post('/', sendMessageValidator, validate, sendMessage);
router.get('/', getMessages);

module.exports = router;
