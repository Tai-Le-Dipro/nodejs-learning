const authController = require("../controllers/authController");

const router = require("express").Router();

router.post("/register", authController.registerUser);

router.post("/signin", authController.signIn);

router.post("/refresh_token", authController.refreshToken);
module.exports = router;
