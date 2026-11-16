import shortUrlModel from "../models/short-url.model.js";
import { ConflictError } from "../utils/errorHandler.js";

export const saveShortUrl = async (shortUrl, longUrl, userId) => {
  try {
    const data = { full_url: longUrl, short_url: shortUrl };

    if (userId) {
      data.user = userId;
    }

    return await shortUrlModel.create(data);
  } catch (error) {
    if (error.code == 11000) {
      throw new ConflictError("Short URL already exists");
    }
    throw error;
  }
};

export const getShortUrl = async (shortUrl) => {
  return await shortUrlModel.findOneAndUpdate(
    { short_url: shortUrl },
    { $inc: { clicks: 1 } },
  );
};

export const getCustomShortUrl = async (slug) => {
  return await shortUrlModel.findOne({ short_url: slug });
};

export const deleteShortUrlDao = async (id, userId) => {
  return await shortUrlModel.findOneAndDelete({ _id: id, user: userId });
};
