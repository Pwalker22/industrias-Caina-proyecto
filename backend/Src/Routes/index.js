const express = require("express");
const routes = express();


const Quotes = require("../Routes/v1/quotes.routes");
const users = require("../Routes/v1/users.routes");
const Scheduling = require("../Routes/v1/scheduling.routes");
const Warranty = require("../Routes/v1/warranty.routes");
const Complaints = require("../Routes/v1/Complaints.routes");
//*ruta login

const login = require("../Routes/v1/login.routes");

routes.use(login);
routes.use(Quotes);
routes.use(users);
routes.use(Scheduling);
routes.use(Warranty);
routes.use(Complaints);

module.exports  = routes;