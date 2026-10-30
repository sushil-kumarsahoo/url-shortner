import { cookiOptions } from "../config/config.js";
import { loginUser, registerUser } from "../services/auth.service.js";

export const register_user = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const { token, user } = await registerUser(name, email, password);
    res.cookie("accessToken", token, cookiOptions);
    res.status(201).json({ message: "register user success", user });
  } catch (err) {
    next(err);
  }
};

export const login_user = async (req, res, next) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;
    const { token, user } = await loginUser(email, password);
    res.cookie("accessToken", token, cookiOptions);
    res.status(200).json({ message: "login user success", user });
  } catch (err) {
    next(err);
  }
};

export const logout_user = async (req, res) => {
    res.clearCookie("accessToken", cookiOptions);
    res.status(200).json({message:"logout success"})
}

export const get_current_user = async (req, res) => {
    res.status(200).json({user:req.user})
}