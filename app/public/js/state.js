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
  populateStateCovidData(data);
  populateStateInfo(data);
  stateCovidSite(data);
});

function populateStateInfo(data) {
  let title = createElement("<h2>", data.state);
  let population = createElement("<h2>", "population: ");
  let governor = createElement("<h2>", "Governor: ");

  $(".state-general").append(title, population, governor);
}

//dynamically populate info to the site
function populateStateCovidData(stateData) {
  stateNoSpace = stateData.state.split(" ").join("");
  let { covidData } = stateData;
  getFlagInfo(stateData.state);

  let li = createElement("<li>");
  let active = createElement("<h2>", `Active cases: ${covidData.active}`);
  let confirmed = createElement(
    "<h2>",
    `Confirmed cases: ${covidData.confirmed}`
  );
  let deaths = createElement("<h2>", `Deaths: ${covidData.deaths}`);
  let death_diff = createElement(
    "<h2>",
    `Num of Deaths compared to previous day: ${covidData.death_diff}`
  );
  let confirm_diff = createElement(
    "<h2>",
    `Num of Confirmed cases compared to previous day: ${covidData.confirmed_diff}`
  );

  li.append(active, confirmed, deaths, death_diff, confirm_diff);
  $(".state-covid").append(li);
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
  });

  function populateToHTML(stateCovidlinks) {
    let link = stateCovidlinks[0].covid19Site;
    let stateLink = createElement("<a>", "View Official State Site", [
      { attr: "href", value: link },
      { attr: "target", value: "blank" },
    ]);
    $(".state-covid").append(stateLink);
  }
}

function createElement(el, text, attr) {
  let newEl = $(`${el}`);
  if (text) {
    newEl.text(text);
  }
  if (attr) {
    attr.forEach((item) => {
      newEl.attr(item.attr, item.value);
    });
  }
  return newEl;
}
