import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {OAuth2Client} from "google-auth-library"

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
export const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


import userRouter from "./routes/user.routes.js";

//routes
app.use("/api/v1/user", userRouter);

export { app };
