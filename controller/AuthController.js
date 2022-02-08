import User from "../models/User.js";
import Token from "../models/Token.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { promisify } from "util";
import catchAsync from "../util/catchAsync.js";
import AppError from "../util/AppError.js";
import crypto from "crypto";

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

const generateTokenValue = () => {
  return ("" + Math.random()).substring(2, 8);
};

export const register = catchAsync(async (req, res, next) => {
  const tokenValue = generateTokenValue();
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const verificationCode = await Token.create({
    value: tokenValue,
    user: user._id,
  });
  // TODO(Send verificationToken via email)
  res.status(201).json({
    success: true,
    user,
    verificationCode: verificationCode.value,
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError("No user found with that email", 401));
  }
  const verified = await bcrypt.compare(password, user.password);
  if (!verified) {
    return next(new AppError("Incorrect password given", 401));
  }
  createSendToken(user, 200, res);
});

export const verify = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const tokenValue = req.params.token;
  const userToVerify = await User.findById(id);
  if (!userToVerify) {
    return next(new AppError("No user found with that id", 400));
  }
  const userToken = await Token.findOne({ value: tokenValue }).populate("user");
  if (!userToken) {
    return next(new AppError("No token found with that value", 400));
  }
  if (userToken.user._id.toString() !== userToVerify._id.toString()) {
    return next(new AppError("User id provided does not match token", 400));
  }
  userToVerify.verified = true;
  await userToVerify.save();
  await Token.findByIdAndDelete(userToken._id);
  res.status(200).json({
    success: true,
  });
});

export const authenticate = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in, please log in to gain access", 401)
    );
  }
  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );
  const embeddedId = decodedToken.id;
  const currentUser = await User.findById(embeddedId);
  if (!currentUser) {
    return next(new AppError("User on this token no longer exists", 401));
  }
  req.user = currentUser;
  next();
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const res = await User.findByIdAndDelete(id);
  if (!res) {
    return next(new AppError("No use found with that id"));
  }
  res.status(204).json({});
});
