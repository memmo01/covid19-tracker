module.exports = function (data, matchData) {
  return data.filter((stateData) => {
    if (JSON.stringify(stateData.state) === JSON.stringify(matchData)) {
      return stateData;
    }
  });
};