const userModal = require("../models/User");

const userController = {
  // GET ALL USER
  getUser: async (req, res) => {
    try {
      await userModal.find({})
        .then((data) => {
          return res.status(200).json(data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      return res.status(500).json(error);
    }
  },

  // DELETE USER
  deleteUser: async (req, res) => {
    try {
      await userModal.findById(req.params.id);
      return res.status(200).json({message: "Delete user Succesfull!"});
    } catch (error) {
      return res.status(500).json(error);
    }
  }
};

module.exports = userController;
