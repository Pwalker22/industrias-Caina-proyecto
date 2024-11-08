const express = require("express");
const router = require("../routes/index.js"); 
const morgan = require("morgan");
const bodyParser = require("body-parser"); 
const cors = require("cors");
const path = require('path'); 

const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("dev"));


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});


app.use(express.static(path.join(__dirname, '../../../frontend')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../frontend', 'Index.html')); 
});


app.use("/api/v1", router);

module.exports = app;
