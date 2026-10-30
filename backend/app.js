import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cors from "cors";
import connectDB from "./src/config/mongo.config.js";
import shortUrlRouter from "./src/routes/short-url.route.js"
import { errorHandler } from "./src/utils/errorHandler.js";
import { redirectFromshortUrl } from "./src/controllers/short-url.controller.js";
import authRouter from "./src/routes/auth.route.js";
import cookieParser from "cookie-parser";


app.use(cors({
  origin: 'http://localhost:5173', // Explicitly allow your frontend origin
  credentials: true                // Allow cookies/headers to be sent through
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api", shortUrlRouter);
app.get("/:id",redirectFromshortUrl);

app.use(errorHandler);     // must be the LAST middleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
