const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

let refreshTokenArray = [];

const authController = {
  // Handle Register User
  registerUser: async (req, res) => {
    const { username, password, email } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await new User({
        username,
        email,
        password: hashedPassword,
      });
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // GENERATE ACCESS TOKEN
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET_ACCESS_TOKEN,
      {
        expiresIn: "30s",
      }
    );
  },
  //  GERERATE REFRESH TOKEN
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET_REFRESH_TOKEN,
      {
        expiresIn: "365d",
      }
    );
  },

  // Handle Login
  signIn: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        res.status(400).json({ message: "Email does not exist" });
      } else {
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!validPassword) {
          res.status(400).json({ message: "Password is not correct!" });
        } else {
          const accessToken = authController.generateAccessToken(user);
          const refreshToken = authController.generateRefreshToken(user);

          res.cookie("refreshToken", refreshToken, {
            secure: false,
            httpOnly: true,
            sameSite: "strict",
          });
          refreshTokenArray.push(refreshToken);

          const { password, ...data } = user._doc;

          res.status(200).json({
            message: "Login successful",
            data,
            accessToken,
          });
        }
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  refreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken)
      return res.status(401).json({ message: "You're not authenticated" });

    if (!refreshTokenArray.includes(refreshToken)) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_SECRET_REFRESH_TOKEN,
      (err, user) => {
        if (err) {
          console.log(err);
        }

        refreshTokenArray = refreshTokenArray.filter(
          (token) => token !== refreshToken
        );
        console.log("refreshTokenArray: ", refreshTokenArray);

        const newAccessToken = authController.generateAccessToken(user);
        const newRefreshToken = authController.generateRefreshToken(user);

        refreshTokenArray.push(newRefreshToken);

        res.cookie("refreshToken", refreshToken, {
          secure: false,
          httpOnly: true,
          sameSite: "strict",
        });

        res.status(200).json({ accessToken: newAccessToken });
      }
    );
  },
};

module.exports = authController;
