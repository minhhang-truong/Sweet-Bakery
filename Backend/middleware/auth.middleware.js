const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
      return res.status(401).json({ message: "No token" });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;   // gắn user vào req để các route phía sau dùng
      next();
  } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = verifyToken;