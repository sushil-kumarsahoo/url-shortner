import axiosInstance from "../utils/axiosInstance.js"

export const createShortUrl = async (url, slug) => {
    const { data } = await axiosInstance.post("/api/create", { url, slug });
    return data.shortUrl;
};

export const deleteShortUrlApi = async (id) => {
    const { data } = await axiosInstance.delete(`/api/url/${id}`);
    return data;
};
