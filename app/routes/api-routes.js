let stateData = require("../data/state-info.js");

module.exports = function (app) {
  app.get("/api/state/:state", function (req, res) {
    console.log(req.params.state);
    //get state and begin running it through api calls to gather information about covid, general state info (population, governer, any updated news (state of emergencies)), a weeks worth of data, and nearby covid testing centers
    res.json({ state: req.params.state, population: 300000 });
  });

  app.post("/api/saveStateData/", function (req, res) {
    stateData = req.body;
  });

  app.get("/api/stateData", function (req, res) {
    res.json(stateData);
  });
};
