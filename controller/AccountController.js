import Account from "../models/Account.js";
import catchAsync from "../util/catchAsync.js";
import AppError from "../util/AppError.js";
import User from "../models/User.js";

export const createAccount = catchAsync(async (req, res, next) => {
  const { name, balance, userId } = req.body;
  if (!name) {
    return next(
      new AppError("name must be provided when creating an account", 400)
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError(`No user found with that id ${userId}`, 400));
  }

  const account = await Account.create({
    name,
    balance,
    owner: userId,
  });

  res.status(201).json({
    success: true,
    account,
  });
});

export const getAllAccounts = catchAsync(async (req, res, next) => {
  const accounts = await Account.find({});
  res.status(200).json({
    success: true,
    accounts,
  });
});

export const getAccountById = catchAsync(async (req, res, next) => {});
export const getUserAccounts = catchAsync(async (req, res, next) => {});
export const updateAccount = catchAsync(async (req, res, next) => {});
