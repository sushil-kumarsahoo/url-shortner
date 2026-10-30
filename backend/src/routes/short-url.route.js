import express from "express";
import { createShortUrl } from "../controllers/short-url.controller.js";
import { attachUserMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/create",attachUserMiddleware ,createShortUrl);

export default router;
