import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] ||
    req.query.token ||
    req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided!" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Invalid Token", error: error.message });
  }
};

export default verifyToken;
