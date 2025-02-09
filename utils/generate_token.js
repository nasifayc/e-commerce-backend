import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
  if (!user || !user._id) {
    throw new Error("Invalid user object provided for token generation");
  }
  return jwt.sign({ id: user._id.toString() }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (user) => {
  if (!user || !user._id) {
    throw new Error("Invalid user object provided for token generation");
  }
  return jwt.sign({ id: user._id.toString() }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};
