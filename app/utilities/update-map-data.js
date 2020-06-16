let statedata = require("../data/state.js");

// //get api data, loop through it..within loop, loop through features. if there is a match on state then add data about cases and deaths
// // sort through the features
// statedata.features;

module.exports = function (covidStateData) {
  for (let i = 0; i <= 50; i++) {
    for (let d = 0; d < statedata.features.length; d++) {
      if (
        statedata.features[d].properties.name ===
        covidStateData[i].region.province
      ) {
        statedata.features[d].properties.deaths = covidStateData[i].deaths;
        statedata.features[d].properties.cases = covidStateData[i].confirmed;
        break;
      }
    }
  }
  return statedata;
};
