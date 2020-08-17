let queryDb = require("../utilities/query-db");
let filterData = require("../utilities/filters");

module.exports = function (app, axios) {

  // get information about state twitter
  app.get("/api/covidtracking/:stateabbr", function (req, res) {
    axios({ url: "https://covidtracking.com/api/states/info", method: "GET" }).then(function (response) {
      let stateCovidUrl = filterData(response.data, req.params.stateabbr);
      res.json(stateCovidUrl);
    });
  });


  app.get("/api/state/:state", function (req, res) {
    //get state and begin running it through api calls to gather information about covid, general state info (population, governer, any updated news (state of emergencies)), a weeks worth of data, and nearby covid testing centers
    res.json({ state: req.params.state, population: 300000 });
  });

  app.get("/api/covidnews", function (req, res) {
    axios({
      url: "https://api.smartable.ai/coronavirus/news/US",
      method: "GET",
      headers: { "Subscription-Key": process.env.SUB_KEY },
    }).then(function (response) {
      res.json(response.data.news);
    });
  });

  //gets data of the last 5 days on the US
  app.get("/api/covidFiveDay", function (req, res) {
    queryData().then(function (data) {
      let history = data.data.stats.history;
      let newData = [];
      for (let i = 1; i < 6; i++) {
        newData.push(history[history.length - i]);
      }
      res.json(newData);
    });
  });

  function queryData() {
    return axios({
      url: "https://api.smartable.ai/coronavirus/stats/US",
      method: "GET",
      headers: { "Subscription-Key": process.env.SUB_KEY },
    });
  }

  app.get("/api/governor/:state", function (req, res) {
    //call sequelize on query -db page
    queryDb.getGovernor(req.params.state).then(function (data) {
      let govName = data[0].name;

      res.json(govName);
    });

  });

};


