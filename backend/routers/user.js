const userController = require("../controllers/userController");

const router = require("express").Router();

router.get("/users", userController.getUser)

// delete user
router.delete("/user/:id", userController.deleteUser)

module.exports = router;