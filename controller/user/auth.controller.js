import jwt from "jsonwebtoken";
import User from "../../model/user.model.js";
import sendEmail from "../../config/sendMail.js";

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const newUser = new User({
      username,
      email,
      password,
    });

    const otp = newUser.generateOtp();
    await newUser.save();

    const otpMessage = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #4CAF50;">Welcome to Our Service!</h2>
        <p>Dear User,</p>
        <p>Thank you for registering with us. Please use the following OTP code to complete your registration:</p>
        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; color: #4CAF50; border: 2px solid #4CAF50; padding: 10px 20px; border-radius: 5px;">
            ${otp}
          </span>
        </div>
        <p style="color: #666;">This code is valid for 24 hours. If you didn’t request this, please ignore this email.</p>
        <p>Best regards,<br>The Support Team</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
        <footer style="text-align: center; color: #999; font-size: 12px;">
          © ${new Date().getFullYear()} Our Company, Inc. All rights reserved.
        </footer>
      </div>`;

    await sendEmail(email, "Your OTP is here", otpMessage);

    res.status(201).json({
      message:
        "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (e) {
    res.status(500).json({
      message: "Error registering user.",
      error: error.message,
    });
  }
};

export const validateOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const isOtpValid = user.validateOtp(otp);

    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry for refresh token
    });

    res.status(200).json({
      message: "Registration completed successfully.",
      user: user.toJSON(),
      accessToken,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error validating OTP.",
      error: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  console.log("reached here");
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or  password" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or  password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookies("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry for refresh token
    });

    res.status(200).json({ user: user.toJSON(), accessToken });
  } catch (e) {
    res.status(500).json({
      message: "Error signing in user.",
      error: error.message,
    });
  }
};

// Refresh Access Token
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided." });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ message: "Invalid or expired refresh token." });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(404).json({ message: "User not found." });
        }

        const newAccessToken = generateAccessToken(user);
        res.status(200).json({
          accessToken: newAccessToken,
        });
      }
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error refreshing token.", error: error.message });
  }
};
