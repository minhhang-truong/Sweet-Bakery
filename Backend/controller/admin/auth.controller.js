const Account = require("../../model/accountUser.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Logic cũ là findManagerByEmail -> Vẫn dùng hàm này nhưng model đã sửa để query DB mới
        const user = await Account.findManagerByEmail(email);

        if (!user){
            return res.status(404).json({ error: 'User not found' });
        }

        // SỬA: Role cũ là số 3, role mới là string 'admin' (hoặc manager tùy bạn config DB)
        // Ở đây mình để 'admin' vì thường trang admin chỉ cho admin vào.
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'You do not have permission to login here' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid password' });

        // Token giữ nguyên cấu trúc, role giờ là string
        const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '3h',
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: false, // Để false nếu chạy localhost http, lên https thì để true
          sameSite: "strict"
        });

        res.json({ message: 'Login successful', user: {
          id: user.id,
          role: user.role,
          email: user.email,
          fullname: user.fullname,
        } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  });
  res.json({ message: "Logged out" });
}

module.exports.getProfile = async (req, res) => {
    try {
        const id  = parseInt(req.params.id);
        const manager = await Account.findManagerById(id);
        res.json(manager);
    } catch (err) {
        console.error(err); // Sửa lỗi gõ sai onsole -> console
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports.updateProfile = async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        // req.user.id lấy từ token (middleware đã decode)
        if (req.user.id !== userId) {
            return res.status(403).json({ error: 'You do not have permission to update this profile' });
        }
        
        // Model đã được sửa để tách fullname -> first/last name
        const result = await Account.updateManager(req.body, userId);
        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports.changePassword = async (req, res) => {
  const userId = parseInt(req.params.id);
  const {currentPassword, newPassword} = req.body;
  
  if (req.user.id != userId) {
    return res.status(403).json({ error: "You can only change your own password" });
  }

  const result = await Account.getPassword(userId);
  if (!result) { // Sửa check result null
      return res.status(404).json({ error: "User not found" });
  }

  const hashedPassword = result.password;

  const match = await bcrypt.compare(currentPassword, hashedPassword);
  if (!match) {
    return res.status(400).json({ error: "Current password is incorrect" });
  }

  const newHashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    await Account.changePassword(userId, newHashedPassword);
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password failed:", err);
    res.status(500).json({ error: "Server error" });
  }
}