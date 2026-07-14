const prisma = require('../config/db');

const createConsultation = async (patientId, doctorId) => {
  // Check if doctor exists and has role DOCTOR
  const doctor = await prisma.user.findFirst({
    where: { id: doctorId, role: 'DOCTOR' }
  });

  if (!doctor) {
    const error = new Error('Doctor not found');
    error.statusCode = 404;
    throw error;
  }

  const consultation = await prisma.consultation.create({
    data: {
      patientId,
      doctorId
    }
  });

  return consultation;
};

const getConsultations = async (userId, role, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const where = role === 'PATIENT' ? { patientId: userId } : { doctorId: userId };

  const [total, consultations] = await Promise.all([
    prisma.consultation.count({ where }),
    prisma.consultation.findMany({
      where,
      skip,
      take: limit,
      include: {
        patient: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return {
    consultations,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const getConsultationById = async (id, userId, role) => {
  const consultation = await prisma.consultation.findUnique({
    where: { id: parseInt(id, 10) },
    include: {
      patient: { select: { id: true, name: true, email: true } },
      doctor: { select: { id: true, name: true, email: true } }
    }
  });

  if (!consultation) {
    const error = new Error('Consultation not found');
    error.statusCode = 404;
    throw error;
  }

  // Check authorization
  if (role === 'PATIENT' && consultation.patientId !== userId) {
    const error = new Error('Not authorized to access this consultation');
    error.statusCode = 403;
    throw error;
  }

  if (role === 'DOCTOR' && consultation.doctorId !== userId) {
    const error = new Error('Not authorized to access this consultation');
    error.statusCode = 403;
    throw error;
  }

  return consultation;
};

const updateConsultationStatus = async (id, doctorId, status) => {
  const consultation = await prisma.consultation.findUnique({
    where: { id: parseInt(id, 10) }
  });

  if (!consultation) {
    const error = new Error('Consultation not found');
    error.statusCode = 404;
    throw error;
  }

  if (consultation.doctorId !== doctorId) {
    const error = new Error('Only the assigned doctor can update the status');
    error.statusCode = 403;
    throw error;
  }

  if (consultation.status === 'COMPLETED') {
    const error = new Error('Completed consultations cannot be modified');
    error.statusCode = 400;
    throw error;
  }

  const updatedConsultation = await prisma.consultation.update({
    where: { id: parseInt(id, 10) },
    data: { status }
  });

  return updatedConsultation;
};

module.exports = {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultationStatus
};
