module.exports = function (app) {
  app.get("/api/state/:state", function (req, res) {
    console.log(req.params.state);
    //get state and begin running it through api calls to gather information about covid, general state info (population, governer, any updated news (state of emergencies)), a weeks worth of data, and nearby covid testing centers
    res.json({ state: req.params.state, population: 300000 });
  });
};
