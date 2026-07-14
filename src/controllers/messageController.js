const messageService = require('../services/messageService');

const sendMessage = async (req, res, next) => {
  try {
    // consultation id comes from params since route is mounted at /consultations/:id/messages
    const consultationId = req.params.id;
    const { message } = req.body;
    
    const sentMessage = await messageService.sendMessage(consultationId, req.user.id, message);
    
    res.status(201).json({
      success: true,
      data: sentMessage
    });
  } catch (error) {
    next(error);
  }
};

const getMessages = async (req, res, next) => {
  try {
    const consultationId = req.params.id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await messageService.getMessages(consultationId, req.user.id, page, limit);
    
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getMessages
};
