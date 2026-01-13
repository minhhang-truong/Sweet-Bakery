const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  // Lấy token từ cookie (khớp với controller cũ dùng res.cookie)
  const token = req.cookies.token;
  if (!token) {
      return res.status(401).json({ message: "No token" });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // DB MỚI: Token sẽ chứa { id: user_id, role: 'admin', email: ... }
      // req.user sẽ có cấu trúc y hệt vậy -> Các middleware sau dùng bình thường.
      req.user = decoded;   
      next();
  } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = verifyToken;