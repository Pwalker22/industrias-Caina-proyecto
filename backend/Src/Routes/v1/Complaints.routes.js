const router = require("express").Router();
const complaintsController = require("../../Controller/v1/Complaints.controller");
const Module = "complaints";

//*Modulo

const options = {
  Module: Module,
};

router.get("/complaints", complaintsController.getComplaints)
      .post("/saveComplaint", complaintsController.createComplaint)
      .put("/updateComplaint/:id", complaintsController.updateComplaint)
      .delete("/deleteComplaint/:id", complaintsController.deleteComplaint);

module.exports = router;
