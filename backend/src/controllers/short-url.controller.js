import { getShortUrl } from "../dao/short-url.dao.js";
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
    res.status(201).json({ shortUrl: `${process.env.APP_URL}/${shortUrl}` });
  } catch (err) {
    next(err);
  }
};

export const redirectFromshortUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const url = await getShortUrl(id);
    if (!url) throw new NotFoundError("Short URL not found");
    res.redirect(url.full_url);
  } catch (err) {
    next(err);
  }
};

export const createCustomShortUrl = async (req, res, next) => {
  try {
    const { url, slug } = req.body;
    const shortUrl = await createShortUrlWithUser(url, req.user._id, slug);
    res.status(201).json({ shortUrl: `${process.env.APP_URL}/${shortUrl}` });
  } catch (err) {
    next(err);
  }
};
