import express from "express";
import { authenticate } from "../controller/AuthController.js";
import { createAccount } from "../controller/AccountController.js";

const AccountRouter = express();

AccountRouter.route("/account").post(authenticate, createAccount);

export default AccountRouter;
