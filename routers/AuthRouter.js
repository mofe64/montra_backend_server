import express from "express";
import {
  register,
  login,
  verify,
  deleteUser,
} from "../controller/AuthController.js";

const AuthRouter = express();

AuthRouter.route("/register").post(register);

AuthRouter.route("/login").post(login);

AuthRouter.route("/verify/:id/:token").get(verify);

AuthRouter.route("/delete/:id").delete(deleteUser);

export default AuthRouter;
