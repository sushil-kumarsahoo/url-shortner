import { findUserById } from "../dao/user.dao.js";
import { UnauthorizedError } from "../utils/errorHandler.js";
import { verifyToken } from "../utils/helper.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return new UnauthorizedError("Unauthorized");
  try {
    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id);
    if (!user) return new UnauthorizedError("Unauthorized");
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export const attachUserMiddleware = async (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) return next(); // guest: continue without req.user

  try {
    const decoded = verifyToken(token);
    const user = await findUserById(decoded.id);
    if (user) req.user = user; // logged-in user
  } catch (error) {
    // invalid or expired token: treat as a guest
  }
  next();
};