import express from "express";
import { register, login, verify } from "../controller/AuthController.js";

const AuthRouter = express();

AuthRouter.route("/register").post(register);

AuthRouter.route("/login").post(login);

AuthRouter.route("/verify/:id/:token").get(verify);

export default AuthRouter;
