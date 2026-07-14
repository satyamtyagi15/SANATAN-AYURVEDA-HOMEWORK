const express = require('express');
const { createConsultation, getConsultations, getConsultation, updateStatus } = require('../controllers/consultationController');
const { createConsultationValidator, updateConsultationStatusValidator } = require('../validators/consultationValidator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const messageRoutes = require('./messageRoutes');

const router = express.Router();

router.use(authenticate);

// Mount message routes
router.use('/:id/messages', messageRoutes);

router.post('/', authorize('PATIENT'), createConsultationValidator, validate, createConsultation);
router.get('/', getConsultations);
router.get('/:id', getConsultation);
router.patch('/:id/status', authorize('DOCTOR'), updateConsultationStatusValidator, validate, updateStatus);

module.exports = router;
