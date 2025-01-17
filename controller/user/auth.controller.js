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

const sendMail = async (email, otp) => {
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
          © ${new Date().getFullYear()} Yegna E-commrece, Inc. All rights reserved.
        </footer>
      </div>`;

  await sendEmail(email, "Your OTP is here", otpMessage);
};

export const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Username: " + username);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.otpValidated) {
        return res.status(400).json({ message: "Email already in use." });
      } else {
        if (existingUser.otpExpiry > new Date()) {
          return res
            .status(400)
            .json({ message: "User Found But, Otp is not Validated" });
        } else {
          const isPasswordValid = await existingUser.comparePassword(password);

          if (!isPasswordValid) {
            return res
              .status(400)
              .json({ message: "User Found But, Invalid email or  password" });
          }
          const otp = await existingUser.generateOtp();
          console.log("OTP: " + otp);
          await existingUser.save();

          const { email } = existingUser;

          await sendMail(email, otp);
          res.status(201).json({
            message:
              "OTP sent to your email. Please verify to complete registration.",
            user: existingUser.toJSON(),
          });
        }
      }
    } else {
      const newUser = new User({
        username,
        email,
        password,
      });

      const otp = await newUser.generateOtp();
      console.log("OTP: " + otp);
      await newUser.save();

      await sendMail(email, otp);
      res.status(201).json({
        message:
          "OTP sent to your email. Please verify to complete registration.",
        user: newUser.toJSON(),
      });
    }
  } catch (e) {
    res.status(500).json({
      message: `Error registering user: ${e.message}`,
      error: e.message,
    });
  }
};

export const validateOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(`email: ${email}, otp: ${otp}`);

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    const isOtpValid = await user.validateOtp(otp);

    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry for refresh token
    });

    res.status(200).json({
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
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or  password" });
    }

    if (!user.otpValidated) {
      return res.status(400).json({ message: "OTP Validation Required" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or  password" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry for refresh token
    });

    res.status(200).json({ user: user.toJSON(), accessToken });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({
      message: `Error signing in user. ${e.message}`,
      error: e.message,
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
