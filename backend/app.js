import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import cors from "cors";
import connectDB from "./src/config/mongo.config.js";
import shortUrlRouter from "./src/routes/short-url.route.js"

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", shortUrlRouter);

app.use(notFoundHandler);  // after all routes
app.use(errorHandler);     // must be the LAST middleware

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
