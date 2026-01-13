const Account = require("../../model/accountUser.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Account.findByEmail(email);

        if (!user){
            return res.status(404).json({ error: 'User not found' });
        }

        // SỬA: Check role theo string 'customer' thay vì số 1
        if (user.role !== 'customer') {
            return res.status(403).json({ error: 'You do not have permission to login here' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid password' });

        // Token giữ nguyên cấu trúc
        const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '3h',
        });

        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
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

module.exports.signup = async(req, res) => {
    try {
    const {name, email, password } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password and name are required' });
    }

    const existing = await Account.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    await Account.transaction(true);

    req.body.password = await bcrypt.hash(password, 10);

    // Model signUp đã sửa để insert vào user_account
    const result = await Account.signUp(req.body);
    result.name = name; // Gán lại name để hàm addCus dùng tách chuỗi

    // Model addCus đã sửa để update first_name/last_name và insert vào customer
    await Account.addCus(result);
    await Account.transaction(false);

    return res.status(201).json({
      message: 'Signup successful',
      user: { id: result.id, email: result.email, fullname: name }
    });
  } catch (err) {
    await Account.transaction(false); // Rollback nếu lỗi (cần implement rollback trong model nếu chưa có, hoặc catch transaction)
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports.updateUser = async(req, res) => {
  const userId = parseInt(req.params.id);
  // Bảo mật: Chỉ cho phép update chính mình
  if (req.user.id !== userId) {
    return res.status(403).json({ error: "You can only update your own profile" });
  }

  const data = {
    name: req.body.name, // Model sẽ tự tách thành first_name, last_name
    email: req.body.email,
    id: userId,
    phone: req.body.phone,
    address: req.body.address,
    dob: req.body.dob,
  }

  try {
    const result = await Account.update(data);
    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports.userProfile = async(req, res) => {
  const userId = parseInt(req.params.id);
  if (userId !== req.user.id)
    return res.status(403).json({ error: "Forbidden" });

  const user = await Account.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
}

module.exports.logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "strict"
  });
  res.json({ message: "Logged out" });
}

module.exports.changePassword = async (req, res) => {
  const userId = parseInt(req.params.id);
  const {currentPassword, newPassword} = req.body;
  
  if (req.user.id !== userId) {
    return res.status(403).json({ error: "You can only change your own password" });
  }

  const result = await Account.getPassword(userId);
  if (!result) {
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