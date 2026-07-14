const prisma = require('../config/db');

const getAllDoctors = async () => {
  const doctors = await prisma.user.findMany({
    where: { role: 'DOCTOR' },
    select: {
      id: true,
      name: true,
      email: true,
      doctorProfile: {
        select: {
          specialization: true,
          yearsOfExperience: true
        }
      }
    }
  });
  return doctors;
};

const getDoctorById = async (id) => {
  const doctor = await prisma.user.findFirst({
    where: { 
      id: parseInt(id, 10),
      role: 'DOCTOR'
    },
    select: {
      id: true,
      name: true,
      email: true,
      doctorProfile: {
        select: {
          specialization: true,
          yearsOfExperience: true
        }
      }
    }
  });

  if (!doctor) {
    const error = new Error('Doctor not found');
    error.statusCode = 404;
    throw error;
  }

  return doctor;
};

module.exports = {
  getAllDoctors,
  getDoctorById
};
