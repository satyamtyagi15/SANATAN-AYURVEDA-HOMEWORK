const prisma = require('../config/db');
const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt');

const registerUser = async (data) => {
  const { name, email, password, role, specialization, yearsOfExperience } = data;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error = new Error('User with this email already exists');
    error.statusCode = 400;
    throw error;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const userData = {
    name,
    email,
    password: hashedPassword,
    role
  };

  if (role === 'DOCTOR') {
    userData.doctorProfile = {
      create: {
        specialization,
        yearsOfExperience: parseInt(yearsOfExperience, 10)
      }
    };
  }

  const user = await prisma.user.create({
    data: userData,
    include: { doctorProfile: true }
  });

  const token = signToken({ id: user.id, role: user.role });

  return { user, token };
};

const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { doctorProfile: true }
  });

  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken({ id: user.id, role: user.role });

  return { user, token };
};

const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { doctorProfile: true }
  });
  
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};
