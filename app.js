import express from "express";
import bodyParser from "body-parser";
import AuthRouter from "./routers/AuthRouter.js";
import cors from "cors";
import globalErrorHandler from "./controller/ErrorController.js";
import AppError from "./util/AppError.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ limit: "10kb", extended: false }));

app.use("/api/v1/auth", AuthRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
