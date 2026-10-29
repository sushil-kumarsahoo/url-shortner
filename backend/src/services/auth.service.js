import { createUser, findUserByEmail } from "../dao/user.dao.js";
import { ConflictError } from "../utils/errorHandler.js";
import { signToken } from "../utils/helper.js";

export const registerUser = async (name, email, password) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new ConflictError("User already exists");

  const user = await createUser(name, email, password);
  const token = signToken({ id: user._id });
  return{user, token};
};
