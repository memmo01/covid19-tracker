let path = window.location.pathname;
let splitpath = path.split("/");
//get url path to obtain state name
let covidState = splitpath[splitpath.length - 1];
let stateNoSpace;
//make call to server using state needing info on
// $.ajax({ url: "/api/state/" + covidState, method: "get" }).then(function (
//   stateData
// ) {
//   populateData(stateData);
// });

$.get("/api/stateData", function (data) {
  populateStateData(data);
  stateCovidSite(data);
});

//dynamically populate info to the site
function populateStateData(stateData) {
  stateNoSpace = stateData.state.split(" ").join("");
  let { covidData } = stateData;
  getFlagInfo(stateData.state);

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
  let backgroundLocation = stateDetail[stateNoSpace];
  $("#flag-contain").css("background-image", `url(/images/state-flags.jpg)`);
  $("#flag-contain").css(
    "background-position",
    `${backgroundLocation.x}px ${backgroundLocation.y}px`
  );
}

//get state covid sites
function stateCovidSite(data) {
  let stateAbbr = stateDetail[stateNoSpace].abbr;

  $.get("https://covidtracking.com/api/states/info", function (data) {
    let stateCovidUrl = data.filter((stateData) => {
      if (JSON.stringify(stateData.state) === JSON.stringify(stateAbbr)) {
        return stateData;
      }
    });
    populateToHTML(stateCovidUrl);
    console.log(stateCovidUrl);
  });

  function populateToHTML(stateCovidlinks) {
    let link = stateCovidlinks[0].covid19Site;
    let stateLink = $("<a>");
    stateLink.text("View Official State Site");
    stateLink.attr("href", link);
    stateLink.attr("target", "_blank");
    $(".state-covid").append(stateLink);
  }
}
