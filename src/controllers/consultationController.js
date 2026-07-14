const consultationService = require('../services/consultationService');

const createConsultation = async (req, res, next) => {
  try {
    const { doctorId } = req.body;
    const consultation = await consultationService.createConsultation(req.user.id, doctorId);
    
    res.status(201).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    next(error);
  }
};

const getConsultations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await consultationService.getConsultations(req.user.id, req.user.role, page, limit);
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

const getConsultation = async (req, res, next) => {
  try {
    const consultation = await consultationService.getConsultationById(req.params.id, req.user.id, req.user.role);
    
    res.status(200).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const consultation = await consultationService.updateConsultationStatus(req.params.id, req.user.id, status);
    
    res.status(200).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createConsultation,
  getConsultations,
  getConsultation,
  updateStatus
};
