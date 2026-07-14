const express = require('express');
const { getDoctors, getDoctor } = require('../controllers/doctorController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Protected routes
router.use(authenticate);

router.get('/', getDoctors);
router.get('/:id', getDoctor);

module.exports = router;
