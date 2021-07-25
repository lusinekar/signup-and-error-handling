const express = require("express");
const userController = require("./userController");

const router = express.Router();

router.post("/signup", userController.createUser);
router.get("/", userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getOneUser)
  .delete(userController.deleteUser);
module.exports = router;
