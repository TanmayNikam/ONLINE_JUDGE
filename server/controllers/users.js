const User = require("../models/users");
const { errorHandling } = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });

const generateToken = (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };
  return {
    token,
    cookieOptions,
  };
};

// header(hashing algorithm),payload(),signature

exports.signup = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;
    const user = await User.create({ username, name, email, password });
    res.status(201).json({
      message: "User Registered Successfully, Please login To continue",
      success: true,
    });
  } catch (error) {
    errorHandling(res, error, "User");
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");
  
    let isAuthenticated = false;
    if (user)
      isAuthenticated = await user.validatePassword(password, user.password);
    if (!user || !isAuthenticated)
      return res.status(200).json({
        message: "Invalid Username or Password",
        success: false,
      });

    user.password = undefined;
    const { token, cookieOptions } = generateToken(user);
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      user, 
      success: true,
      message: "Login Successful",
    });
  } catch (error) {
    console.log(error);
    errorHandling(res, error, "User");
  }
};

exports.isAuthenticated = async (req, res, next) => {
  let token;
  if (
    req.headers?.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({
      message: "Please login to continue!",
      success: false,
    });
  }
  let decoded_id;
  try {
    decoded_id = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Token invalid, please login again!",
      success: false,
    });
  }
  const user = await User.findById(decoded_id.id);
  if (!user) {
    return res.status(401).json({
      message: "User does not exist, please login again!",
      success: false,
    });
  }
  req.user = user;
  next();
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (!req.user.isadmin)
      return res.status(401).json({
        message: "Requires Admin Access",
        success: false,
      });
    next();
  } catch (error) {
    console.log(error);
    res.json({ message: error.message, success: false });
  }
};

exports.getUser = async (req, res) => {
  try {
    let user = req.user;
    if (!user)
      return res.status(400).json({
        message: "Some error occured, please re login!",
        success: false,
      });
    res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    errorHandling(res, error, "User");
  }
};
