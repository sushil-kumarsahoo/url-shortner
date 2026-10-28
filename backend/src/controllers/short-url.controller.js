import { getShortUrl } from "../dao/short-url.dao.js";
import { createShortUrlServiceWithoutUser } from "../services/short-url.service.js";

export const createShortUrl = async (req, res, next) => {
  try {
    const { url } = req.body;
    const shortUrl = await createShortUrlServiceWithoutUser(url);
    res.status(201).json({ shortUrl: `${process.env.APP_URL}/${shortUrl}` });
  } catch (err) {
    next(err);
  }
};

export const redirectFromshortUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const url = await getShortUrl(id);
    res.redirect(url.full_url);
  } catch (err) {
    next(err);
  }
};
