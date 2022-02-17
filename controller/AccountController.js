import Account from "../models/Account.js";
import catchAsync from "../util/catchAsync.js";
import AppError from "../util/AppError.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const createAccount = catchAsync(async (req, res, next) => {
  const { id, name, balance, userId } = req.body;
  const customId = mongoose.Types.ObjectId(id);
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
    _id: customId,
    name,
    balance,
    owner: userId,
  });

  res.status(201).json({
    success: true,
    id: account._id,
    balance: account.balance.toString(),
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
