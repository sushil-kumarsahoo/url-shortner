import userModel from "../models/user.model.js";

export const findUserByEmail = async(email) => {
   return await userModel.findOne({email})
}

export const findUserById = async(id) => {
    return await userModel.findById(id);
} 

export const findUserByEmailWithPassword = async (email) => {
  return await userModel.findOne({ email }).select("+password");
};

export const createUser = async(name, email, password) => {
    const newUser = userModel.create({name, email, password});
    return newUser;
}