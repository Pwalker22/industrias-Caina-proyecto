const router = require("express").Router();
const  warrantyController = require("../../Controller/v1/warranty.controller");
const Module = "warranty";

//*Modulo

const options = {
  Module: Module,
};

router.get("/warranty", warrantyController.getWarranties)
      .post("/saveWarranty", warrantyController.createWarranty)
      .put("/updateWarranty/:id", warrantyController.updateWarranty)
      .delete("/deleteWarranty/:id", warrantyController.deleteWarranty);
      
module.exports = router;