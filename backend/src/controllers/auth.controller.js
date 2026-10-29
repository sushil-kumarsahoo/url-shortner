import { registerUser } from "../services/auth.service.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { token } = await registerUser(name, email, password);
    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};