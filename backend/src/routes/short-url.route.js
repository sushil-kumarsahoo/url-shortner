import express from "express";
import { nanoid } from "nanoid";
import { createShortUrl, redirectFromshortUrl } from "../controllers/short-url.controller.js";
const router = express.Router();

router.post("/create", createShortUrl);
router.get("/:id", redirectFromshortUrl)

export default router;
