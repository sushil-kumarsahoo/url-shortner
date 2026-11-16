import express from "express";
import { createShortUrl, deleteShortUrl } from "../controllers/short-url.controller.js";
import { attachUserMiddleware, authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", attachUserMiddleware, createShortUrl);
router.delete("/url/:id", authMiddleware, deleteShortUrl);

export default router;
