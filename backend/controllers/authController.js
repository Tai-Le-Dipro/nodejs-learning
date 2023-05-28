const bcrypt = require("bcrypt");
const User = require("../models/User");

const authController = {
    // Handle Register User
    registerUser: async (req, res) => {
        const { username, password, email } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await new User({
                username,
                email,
                password: hashedPassword
            })
            const user = await newUser.save();
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json(error)
        }
    },

    // Handle Login
    // Handle Login
    signIn: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                res.status(400).json({ message: "Email does not exist" });
            } else {
                const validPassword = await bcrypt.compare(req.body.password, user.password);
                if (!validPassword) {
                    res.status(400).json({ message: "Password is not correct!" });
                } else {
                    res.status(200).json({ message: "Login successful", user });
                }
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = authController