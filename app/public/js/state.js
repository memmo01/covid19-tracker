let path = window.location.pathname;
let splitpath = path.split("/");
//get url path to obtain state name
let covidState = decodeURIComponent(splitpath[splitpath.length - 1]);
let stateNoSpace = covidState.split(" ").join("");
let time = moment().add(-2, "days").format("YYYY-MM-DD");

checkCovid(covidState).then(function (response) {
  let data = response.data[0];
  populateStateCovidData(data);
  populateStateInfo(data);
  stateCovidSite(data);
});

function checkCovid(state) {
  return $.ajax({
    method: "post",
    url: "/api/checkcovid",
    data: { state: state, time: time },
  }).then(function (data) {
    return data;
  });
}

function populateStateInfo(data) {
  let title = createElement("<h1>", covidState);
  let population = createElement("<h2>", "population: ");
  let governor = createElement("<h2>", "Governor: ");

  $(".state-area").append(title, population, governor);
}

//dynamically populate info to the site
function populateStateCovidData(stateData) {
  getFlagInfo(covidState);

  let div = createElement("<div>");
  div.addClass("graph-contain");
  let active = createElement("<h2>", `Active cases: ${stateData.active}`);
  let confirmed = createElement(
    "<h2>",
    `Confirmed cases: ${stateData.confirmed}`
  );
  let deaths = createElement("<h2>", `Deaths: ${stateData.deaths}`);
  let death_diff = createElement(
    "<h2>",
    `Num of Deaths compared to previous day: ${stateData.death_diff}`
  );
  let confirm_diff = createElement(
    "<h2>",
    `Num of Confirmed cases compared to previous day: ${stateData.confirmed_diff}`
  );

  div.append(active, confirmed, deaths, death_diff, confirm_diff);
  $(".state-covid").append(div);

  attachImg(active, confirmed, deaths, death_diff, confirm_diff);

  //this is a temporary graph placement. it eventually will display updated graph info using google analytics
  function attachImg(...arg) {
    arg.forEach((item) => {
      let img = $("<img>").attr("src", "../images/download.png");
      $(item).after(img);
    });
  }
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
    let twitter;

    let stateLink = createElement("<a>", "View Official State Site", [
      { attr: "href", value: link },
      { attr: "target", value: "blank" },
    ]);
    if (stateCovidlinks[0].twitter) {
      twitter = $("<h2>").text("Twitter: " + stateCovidlinks[0].twitter);

      $(".state-area").append(twitter);
    }
    $(".state-area").append(stateLink);
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
