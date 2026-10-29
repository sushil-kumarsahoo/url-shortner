import { createUser, findUserByEmail } from "../dao/user.dao.js";
import { ConflictError, UnauthorizedError } from "../utils/errorHandler.js";
import { signToken } from "../utils/helper.js";
import bcrypt, { compare } from "bcrypt";

export const registerUser = async (name, email, password) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new ConflictError("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser(name, email, hashedPassword);
  const token = signToken({ id: user._id });
  return { user, token };
};

export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = signToken({ id: user._id });
  return { user, token };
};
