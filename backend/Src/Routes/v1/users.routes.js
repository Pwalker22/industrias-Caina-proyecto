const router = require("express").Router();
const usersController = require("../../Controller/v1/users.controller");
const middleware = require("../../Middleware/protected");
const Module = "users"

//*Modulo

const options = {
  Module: Module,
  
};

router.get("/users", usersController.getUsers)
      .post("/saveUser", usersController.saveUser)
      .put("/updateUser/:id", usersController.updateUser)
      .delete("/deleteUser/:id", usersController.deleteUsers)
      .post("/change-password/:id", usersController.changePassword);
     
module.exports = router;