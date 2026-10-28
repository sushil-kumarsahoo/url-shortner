import { getShortUrl } from "../dao/short-url.dao.js";
import { createShortUrlServiceWithoutUser } from "../services/short-url.services.js";

export const createShortUrl = async (req, res) => {
  try {
    const { url } = req.body;
    const shortUrl = await createShortUrlServiceWithoutUser(url);
    res.status(201).json({shortUrl: `${process.env.APP_URL}/${shortUrl}`});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const redirectFromshortUrl = async (req, res) => {
  const {id} = req.params;
  const url = await getShortUrl(id);
  res.redirect(url.full_url);
}