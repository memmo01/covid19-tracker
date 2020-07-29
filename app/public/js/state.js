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
  let date = createElement("<p>");
  date.text("*as of " + stateData.date);
  div.addClass("graph-contain");
  let active = createElement(
    "<h2>",
    `Active cases: ${stateData.active.toLocaleString()}`
  );
  let confirmed = createElement(
    "<h2>",
    `Confirmed cases: ${stateData.confirmed.toLocaleString()}`
  );
  let deaths = createElement(
    "<h2>",
    `Deaths: ${stateData.deaths.toLocaleString()}`
  );
  let death_diff = createElement(
    "<h2>",
    `Num of Deaths compared to previous day: ${stateData.deaths_diff.toLocaleString()}`
  );
  let confirm_diff = createElement(
    "<h2>",
    `Num of Confirmed cases compared to previous day:  ${stateData.confirmed_diff.toLocaleString()}`
  );
  let dailyChange = [
    { location: death_diff, num: stateData.deaths_diff },
    { location: confirm_diff, num: stateData.confirmed_diff },
  ];

  dailyChange.forEach((subject) => {
    let numIncrease = createElement("<i>");
    let numDecrease = createElement("<i>");
    numIncrease.addClass("fa fa-arrow-circle-up");
    numDecrease.addClass("fa fa-arrow-circle-down");

    if (subject.num > 0) {
      console.log("Larger");
      subject.location.append(numIncrease);
    } else if (subject.num < 0) {
      subject.location.append(numDecrease);
    }
  });

  div.append(date, active, confirmed, deaths, death_diff, confirm_diff);
  $("#state-covid").append(div);

  healthDeptInfo(covidState);
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

function healthDeptInfo(covidState) {
  console.log(covidState);
  //convert text for querying health info api
  let stateText = covidState.split(" ").join("-").toLowerCase();
  console.log(stateText);

  getHealthDept(stateText).then(function (data) {
    console.log(data);
    data.forEach((dept) => {
      displayHTML(dept);
    });
  });
}

function displayHTML(dept) {
  let address;

  if (dept.address) {
    address = dept.address;
  } else {
    address = "";
  }
  let html = `<div> <p>${dept.name}</p> <p>${dept.phone}</p><p>${address}</p><p>${dept.website}</p></div>`;

  $("#state-health-dept").append(html);
}

function getHealthDept(state) {
  return $.ajax({
    url: `https://postman-data-api-templates.github.io/county-health-departments/api/${state}.json`,
    method: "GET",
  });
}
