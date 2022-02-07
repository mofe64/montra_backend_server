import express from "express";
import { register, login } from "../controller/AuthController.js";

const AuthRouter = express();

AuthRouter.route("/register").post(register);

AuthRouter.route("/login").post(login);

export default AuthRouter;
