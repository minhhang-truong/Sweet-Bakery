module.exports.authorize = (...roles) => {
  return (req, res, next) => {
    // LƯU Ý KHI SỬ DỤNG VỚI DB MỚI:
    // req.user.role bây giờ là String ('admin', 'staff', 'customer')
    // Hãy đảm bảo ở file route bạn gọi: authorize('admin') thay vì authorize(1)
    
    if (!req.user || !req.user.role) {
       return res.status(401).json({ error: "Unauthorized: No user role found" });
    }

    if (!roles.includes(req.user.role))
      return res.status(403).json({ error: "Forbidden: You don't have permission" });
    next();
  };
};