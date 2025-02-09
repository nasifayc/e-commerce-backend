import Admin from "../../model/admin.model.js";
import jwt from "jsonwebtoken";
import sendEmail from "../../config/sendMail.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generate_token.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({
        message:
          "You Are Not Registered Yet. Please Contact The Help Center. Thank You",
      });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }
    const isSuperAdmin = await admin.is_superuser;
    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ accessToken, isSuperAdmin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
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
          return res.status(404).json({ message: "Admin not found." });
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
