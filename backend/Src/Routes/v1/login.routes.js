const router =require("express").Router();
const loginController = require("../../Auth/jwt.auth.controller");
const Module = "login"

//*Modulo

const options = {
  Module: Module,
};

// TODO documentación modulo comercial swagger rutas login*/


router.post("/login", loginController.login);

module.exports = router;