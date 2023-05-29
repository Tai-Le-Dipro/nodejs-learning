const middlewareController = require("../controllers/middlewareController");
const userController = require("../controllers/userController");

const router = require("express").Router();

router.get("/users", middlewareController.verifyToken, userController.getUser);

// delete user
router.delete(
  "/user/:id",
  middlewareController.verifyTokenAndAuthorization,
  userController.deleteUser
);

module.exports = router;
