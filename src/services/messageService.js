const prisma = require('../config/db');

const checkConsultationAccess = async (consultationId, userId) => {
  const consultation = await prisma.consultation.findUnique({
    where: { id: parseInt(consultationId, 10) }
  });

  if (!consultation) {
    const error = new Error('Consultation not found');
    error.statusCode = 404;
    throw error;
  }

  if (consultation.patientId !== userId && consultation.doctorId !== userId) {
    const error = new Error('Not authorized to access messages for this consultation');
    error.statusCode = 403;
    throw error;
  }

  return consultation;
};

const sendMessage = async (consultationId, senderId, messageText) => {
  const consultation = await checkConsultationAccess(consultationId, senderId);

  if (consultation.status === 'COMPLETED') {
    const error = new Error('Cannot send messages to a completed consultation');
    error.statusCode = 400;
    throw error;
  }

  const message = await prisma.message.create({
    data: {
      consultationId: parseInt(consultationId, 10),
      senderId,
      message: messageText
    }
  });

  return message;
};

const getMessages = async (consultationId, userId, page = 1, limit = 20) => {
  await checkConsultationAccess(consultationId, userId);

  const skip = (page - 1) * limit;

  const [total, messages] = await Promise.all([
    prisma.message.count({ where: { consultationId: parseInt(consultationId, 10) } }),
    prisma.message.findMany({
      where: { consultationId: parseInt(consultationId, 10) },
      skip,
      take: limit,
      orderBy: { timestamp: 'asc' }, // Chronological order
      include: {
        sender: { select: { id: true, name: true, role: true } }
      }
    })
  ]);

  return {
    messages,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

module.exports = {
  sendMessage,
  getMessages
};
