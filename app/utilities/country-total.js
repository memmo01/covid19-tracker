module.exports = function (response, date) {
  let covidData = response.data.response[0];

  totalData = {
    confirmed: covidData.cases.total,
    deaths: covidData.deaths.total,
    css: {
      x: -298,
      y: 13,
    },
    date: date,
    deaths_diff: covidData.deaths.new,
    confirmed_diff: covidData.cases.new,
  };
  return totalData;
};
