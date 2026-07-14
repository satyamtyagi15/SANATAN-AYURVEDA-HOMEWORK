const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.registerUser(req.body);
    
    // Don't send password in response
    const userResponse = { ...user };
    delete userResponse.password;

    res.status(201).json({
      success: true,
      token,
      data: userResponse
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.loginUser(email, password);
    
    // Don't send password in response
    const userResponse = { ...user };
    delete userResponse.password;

    res.status(200).json({
      success: true,
      token,
      data: userResponse
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    
    const userResponse = { ...user };
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile
};
