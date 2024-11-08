const router = require("express").Router();
const schedulingController = require("../../Controller/v1/scheduling.controller");
const protectedRoute = require("../../Middleware/protected");
const Module = "scheduling";

//* Módulo
const options = {
  Module: Module,
};


router.get("/scheduling", schedulingController.getScheduling) 
      .post("/saveSchedule", schedulingController.scheduleMaintenance)
      .put("/updateScheduling/:id", schedulingController.updateScheduling) 
      .delete("/deleteScheduling/:id", schedulingController.deleteScheduling)
      .get("/getScheduling/:id", schedulingController.getReservationsByUserId);

      
module.exports = router;
