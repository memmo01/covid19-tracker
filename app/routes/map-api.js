const sortData = require("../utilities/update-map-data.js");
const countryTotal = require("../utilities/country-total.js");

module.exports = function (app, axios) {
  app.post("/api/checkcovid", function (req, res) {
    axios({
      url:
        "https://covid-19-statistics.p.rapidapi.com/reports?region_province=" +
        req.body.state +
        "&iso=USA&date=" +
        req.body.time +
        "&q=US%20" +
        req.body.state +
        "",
      method: "GET",
      headers: {
        "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY,
      },
    })
      .then(function (response) {
        res.send(response.data);
      })
      .catch(function (err) {
        res.send(err);
      });
  }),
    app.post("/api/checkgeo", function (req, res) {
      axios({
        url:
          "https://trueway-geocoding.p.rapidapi.com/ReverseGeocode?language=en&location=" +
          req.body.lat +
          "%252C" +
          req.body.lng +
          "",
        method: "GET",
        headers: {
          "x-rapidapi-host": "trueway-geocoding.p.rapidapi.com",
          "x-rapidapi-key": process.env.API_KEY,
        },
      })
        .then(function (response) {
          res.send(response.data);
        })
        .catch(function (err) {
          res.send(err);
        });
    });

  app.get("/api/stateDataSorted", function (req, res) {
    axios({
      url: "https://covid-19-statistics.p.rapidapi.com/reports?country=usa",
      method: "GET",
      headers: {
        "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY,
      },
    }).then(function (response) {
      let sortedData = sortData(response.data.data);
      res.json(sortedData);
    });
  });

  app.post("/api/covidUSATotals", function (req, res) {
    axios({
      url:
        "https://covid-193.p.rapidapi.com/history?day=" +
        req.body.date +
        "&country=usa",
      method: "GET",
      headers: {
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
        "x-rapidapi-key": process.env.API_KEY,
      },
    }).then(function (response) {
      let totals = countryTotal(response, req.body.date);
      res.json(totals);
    });
  });
};
