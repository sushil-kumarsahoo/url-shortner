
import { saveShortUrl } from "../dao/short-url.dao.js";
import { generateNanoId } from "../utils/helper.js";

export const createShortUrlServiceWithoutUser = async (url) => {
  const short_url = generateNanoId(7);
  await saveShortUrl(short_url, url);
  return short_url;
};

export const createShortUrlServiceWithUser = async (url, userId) => {
  const short_url = generateNanoId(7);
  await saveShortUrl(short_url, url, userId);
  return short_url;
};
