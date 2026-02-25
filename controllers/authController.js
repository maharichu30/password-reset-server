import User from "../models/User.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.json({ message: "Registration successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email.trim();

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    //save token & expiry in DB
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

  
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    //create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email, 
      subject: "Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
          <h3>Password Reset Request</h3>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <a href="${resetUrl}" 
             style="display:inline-block; padding:10px 20px; background-color:#000; color:#fff; text-decoration:none; border-radius:5px;">
             Reset Password
          </a>
          <p>If you did not request this, you can ignore this email.</p>
        </div>
      `,
    });
    res.json({ message: "Reset email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending reset email" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    //hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    //remove reset token after successful reset
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    //send success message
    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
