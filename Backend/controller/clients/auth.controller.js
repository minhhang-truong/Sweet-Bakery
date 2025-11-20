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

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
        });

        res.json({ message: 'Login successful', token, user: { id: user.id, email: user.email, name: user.fullname } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

module.exports.signup = async(req, res) => {
    try {
    const {name, email, password } = req.body;

    // Kiểm tra thiếu dữ liệu
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Kiểm tra user tồn tại
    const existing = await Account.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Mã hóa mật khẩu
    req.body.password = await bcrypt.hash(password, 10);

    // Lưu user mới vào DB
    const result = await Account.signUp(req.body);

    // Tạo JWT token
    // const token = jwt.sign(
    //   { id: result.rows[0].id, email },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '1h' }
    // );

    return res.status(201).json({
      message: 'Signup successful',
      // token,
      user: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports.updateUser = async(req, res) => {
  const { id } = req.params;
  const userId = parseInt(req.params.id);
  const data = {
    name: req.body.name,
    email: req.body.email,
    id: userId,
    phone: req.body.phone,
  }
  if (req.user.id != id) {
    return res.status(403).json({ error: "You can only update your own profile" });
  }

  try {
    const result = await Account.update(data);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]); // send updated user info back to frontend
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
  res.json(user);
}