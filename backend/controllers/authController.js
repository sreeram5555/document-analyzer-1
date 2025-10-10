import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { sendEmail } from "../config/mailer.js";
import transporter from "../config/nodemailer.js";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();
const signToken = (payload, expiresIn = "7d") =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
const getTokenFromReq = (req) => {
  if (req.cookies?.token) return req.cookies.token;
  const auth = req.headers.authorization || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7);
  return null;
};

//sign-up
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const existing = await userModel.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    await userModel.create({
      name,
      email,
      password: hashed,
      verifyotp: otp,
      verifyotpexpireat: Date.now() + 10 * 60 * 1000,
      isaccountverified: true,
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "🎉 Welcome to YatraaAI!",
      html: `<h2>Hello ${name},</h2>
             <p>Thanks for registering with YatraaAI 🚀</p>
             <p>Please verify your email with the OTP we just sent.</p>
             <p>We’re glad to have you!</p>`,
    };

    const mailOptionsotp = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<h2>Hello ${name}</h2><p>Your OTP: <b>${otp}</b></p>`,
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailOptionsotp);

    res.json({
      success: true,
      message: "Registered. OT P & welcome email sent.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.verifyotp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() > user.verifyotpexpireat) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isaccountverified = true;
    user.verifyotp = "";
    user.verifyotpexpireat = 0;
    await user.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//resend-otp
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (user.isaccountverified)
      return res.json({ success: false, message: "Already verified" });

    const otp = generateOTP();
    user.verifyotp = otp;
    user.verifyotpexpireat = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resendotp = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Your verification OTP",
      html: `<p>Your OTP: <b>${otp}</b></p>`,
    };

    await transporter.sendMail(resendotp);

    res.json({ success: true, message: "OTP re-sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    if (!user.isaccountverified)
      return res
        .status(400)
        .json({ success: false, message: "Verify your email first" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });

    const token = signToken({ id: user._id });
    setAuthCookie(res, token);

    res.json({ success: true, token, message: `Logged in as ${user.email}` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//send reset otp for forgot password
export const sendResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const otp = generateOTP();
    user.resetotp = otp;
    user.resetotpexpireat = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resendotpreset = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset your password",
      html: `<p>Your reset OTP: <b>${otp}</b></p>`,
    };

    await transporter.sendMail(resendotpreset);

    res.json({ success: true, message: "Reset OTP sent" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newpassword } = req.body;
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.resetotp !== otp)
      return res.json({ success: false, message: "Invalid OTP" });
    if (Date.now() > user.resetotpexpireat)
      return res.json({ success: false, message: "OTP expired" });

    user.password = await bcrypt.hash(newpassword, 10);
    user.resetotp = "";
    user.resetotpexpireat = 0;
    await user.save();

    const resetpassword1 = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password changed",
      html: `<p>Your password has been updated successfully.</p>`,
    };

    await transporter.sendMail(resetpassword1);

    res.json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ success: true, message: "Logged out" });
};

//me copy paste in chatgpt to get clarity
export const me = async (req, res) => {
  try {
    const token = getTokenFromReq(req);
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");
    if (!user)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
