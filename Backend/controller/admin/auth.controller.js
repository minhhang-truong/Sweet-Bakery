const Account = require("../../model/accountUser.model");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Account.findManagerByEmail(email);

        if (!user){
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.role !== 3) {
            return res.status(403).json({ error: 'You do not have permission to login here' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid password' });

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