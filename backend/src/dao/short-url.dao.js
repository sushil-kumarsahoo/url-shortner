import shortUrlSchema from "../models/short-url.model.js";


export const saveShortUrl = async (shortUrl, longUrl, userId) => {
  const data = { full_url: longUrl, short_url: shortUrl };

  if (userId) {
    data.user_id = userId;
  }

  return await shortUrlSchema.create(data);
};

export const getShortUrl = async (shortUrl) => {
     return await shortUrlSchema.findOneAndUpdate({short_url: shortUrl}, {$inc:{clicks:1}})
}