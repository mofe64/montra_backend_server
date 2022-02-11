import express from "express";
import { authenticate } from "../controller/AuthController.js";
import {
  createAccount,
  getAllAccounts,
} from "../controller/AccountController.js";

const AccountRouter = express();

AccountRouter.route("/").post(authenticate, createAccount).get(getAllAccounts);

export default AccountRouter;
