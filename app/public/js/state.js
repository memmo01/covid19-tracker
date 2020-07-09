let path = window.location.pathname;
let splitpath = path.split("/");
//get url path to obtain state name
let covidState = splitpath[splitpath.length - 1];

//make call to server using state needing info on
// $.ajax({ url: "/api/state/" + covidState, method: "get" }).then(function (
//   stateData
// ) {
//   populateData(stateData);
// });

$.get("/api/stateData", function (data) {
  populateData(data);
});

//dynamically populate info to the site
function populateData(stateData) {
  let { covidData } = stateData;
  let backgroundCoordinates = getFlagInfo(stateData.state);

  let li = $("<li>");
  let title = $("<h2>");
  let active = $("<h2>");
  let confirmed = $("<h2>");
  let deaths = $("<h2>");
  let death_diff = $("<h2>");
  let confirm_diff = $("<h2>");

  title.text(stateData.state);
  active.text(`Active cases: ${covidData.active}`);
  confirmed.text(`Confirmed cases: ${covidData.confirmed}`);
  deaths.text(`Deaths: ${covidData.deaths}`);
  death_diff.text(
    `Num of Deaths compared to previous day: ${covidData.death_diff}`
  );
  confirm_diff.text(
    `Num of Confirmed cases compared to previous day: ${covidData.confirmed_diff}`
  );

  li.append(title, active, confirmed, deaths, death_diff, confirm_diff);
  $(".state-general").append(li);
}

function getFlagInfo(state) {
  let st = state.split(" ").join("");
  let backgroundLocation = stateFlagLocation[st];
  $("#flag-contain").css("background-image", `url(/images/state-flags.jpg)`);
  $("#flag-contain").css(
    "background-position",
    `${backgroundLocation.x}px ${backgroundLocation.y}px`
  );
  return backgroundLocation;
}
