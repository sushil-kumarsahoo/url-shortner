import shortUrlSchema from "../models/short-url.model.js";
import { ConflictError } from "../utils/errorHandler.js";

export const saveShortUrl = async (shortUrl, longUrl, userId) => {
  try {
    const data = { full_url: longUrl, short_url: shortUrl };

    if (userId) {
      data.user_id = userId;
    }

    return await shortUrlSchema.create(data);
  } catch (error) {
    if (error.code == 11000) {
      throw new ConflictError("Short URL already exists");
    }
    throw new Error(error);
  }
};

export const getShortUrl = async (shortUrl) => {
  try {
    return await shortUrlSchema.findOneAndUpdate(
      { short_url: shortUrl },
      { $inc: { clicks: 1 } },
    );
  } catch (error) {
    next(error);
  }
};
