import { cookiOptions } from "../config/config.js";
import { findUserByEmail } from "../dao/user.dao.js";
import User from "../models/user.model.js";
import { loginUser, registerUser } from "../services/auth.service.js";
import { OAuth2Client } from "google-auth-library";
import { signToken } from "../utils/helper.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const google_auth = async (req, res, next) => {
  try {
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
      });
    } else if (!user.googleId) {
      //link google account to existing user if not already linked
      user.googleId = googleId;
      if (!user.avatar) user.avatar = picture;
      await user.save();
    }

    const token = signToken({ id: user._id });
    res.cookie("accessToken", token, cookiOptions);

    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(200).json({
      success: true,
      message: "Google login successful",
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

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
    console.log(req.body);
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
  res.status(200).json({ message: "logout success" });
};

export const get_current_user = async (req, res) => {
  res.status(200).json({ user: req.user });
};
