import express from "express";
import { nanoid } from "nanoid";
import { createShortUrl } from "../controllers/short-url.controller.js";
const router = express.Router();

router.post("/create", createShortUrl);

export default router;
