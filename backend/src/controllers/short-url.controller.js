import { deleteShortUrlDao, getShortUrl } from "../dao/short-url.dao.js";
import {
  createShortUrlWithoutUser,
  createShortUrlWithUser,
} from "../services/short-url.service.js";
import { NotFoundError } from "../utils/errorHandler.js";

export const createShortUrl = async (req, res, next) => {
  try {
    const data = req.body;
    const shortUrl = req.user
      ? await createShortUrlWithUser(data.url, req.user._id, data.slug)
      : await createShortUrlWithoutUser(data.url);
    res.status(201).json({ shortUrl: `${process.env.APP_URL?.trim() || 'http://localhost:5000'}/${shortUrl}` });
  } catch (err) {
    next(err);
  }
};

export const redirectFromshortUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const url = await getShortUrl(id);
    if (!url) throw new NotFoundError("Short URL not found");
    let targetUrl = url.full_url;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }
    res.redirect(targetUrl);
  } catch (err) {
    next(err);
  }
};

export const createCustomShortUrl = async (req, res, next) => {
  try {
    const { url, slug } = req.body;
    const shortUrl = await createShortUrlWithUser(url, req.user._id, slug);
    res.status(201).json({ shortUrl: `${process.env.APP_URL?.trim() || 'http://localhost:5000'}/${shortUrl}` });
  } catch (err) {
    next(err);
  }
};

export const deleteShortUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await deleteShortUrlDao(id, req.user._id);
    if (!deleted) {
      throw new NotFoundError("Short URL not found or unauthorized to delete");
    }
    res.status(200).json({ success: true, message: "Short URL deleted successfully" });
  } catch (err) {
    next(err);
  }
};
