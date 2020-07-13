var express = require("express");
var bodyParser = require("body-parser");
var app = express();
const dotenv = require("dotenv").config();

const axios = require("axios");
var PORT = process.env.PORT || 80;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("app/public"));

require("./app/routes/map-api.js")(app, axios);
require("./app/routes/html-routes.js")(app);
require("./app/routes/api-routes.js")(app, axios);
app.listen(PORT, function () {
  console.log("application is listening on PORT " + PORT);
});
