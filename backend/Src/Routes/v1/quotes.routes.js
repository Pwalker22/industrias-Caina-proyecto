const router = require("express").Router();
const quotesController = require("../../Controller/v1/quotes.controller");
const Module = "quotes";

//*Modulo

const options = {
  Module: Module,
};



router.get("/quotes",quotesController.getQuotes)
      .post("/saveQuotes", quotesController.saveQuotes)
      .put("/updateQuotes/:id", quotesController.updateQuotes)
      .delete("/deleteQuotes/:id", quotesController.deleteQuotes);
      
module.exports = router;
