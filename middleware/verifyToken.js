import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token =
    req.headers["authorization"]?.split(" ")[1] ||
    req.query.token ||
    req.cookies?.token;

  if (!token) {
    console.log("Invalid token");
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("Error: " + error);

    return res
      .status(403)
      .json({ message: "Invalid Token", error: error.message });
  }
};

export default verifyToken;
