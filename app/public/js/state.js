let stateFlagDetail = {
  Alabama: { x: 0, y: -7, abbr: "AL" },
  Alaska: { x: -134, y: -7, abbr: "AK" },
  Arizona: { x: -265, y: -7, abbr: "AZ" },
  Arkansas: { x: -399, y: -7, abbr: "AS" },
  California: { x: -532, y: -7, abbr: "CA" },
  Colorado: { x: -669, y: -7, abbr: "CO" },
  Connecticut: { x: 0, y: -140, abbr: "CT" },
  Delaware: { x: -134, y: -140, abbr: "DE" },
  DistrictofColumbia: { x: -796, y: -7, abbr: "DC" },
  Florida: { x: -268, y: -140, abbr: "FL" },
  Georgia: { x: -399, y: -140, abbr: "GA" },
  Hawaii: { x: -532, y: -140, abbr: "HI" },
  Idaho: { x: -669, y: -140, abbr: "ID" },
  Illinois: { x: -796, y: -140, abbr: "IL" },
  Indiana: { x: 0, y: -270, abbr: "IN" },
  Iowa: { x: -134, y: -270, abbr: "IA" },
  Kansas: { x: -268, y: -270, abbr: "KS" },
  Kentucky: { x: -399, y: -270, abbr: "KY" },
  Louisiana: { x: -532, y: -270, abbr: "LA" },
  Maine: { x: -669, y: -270, abbr: "ME" },
  Maryland: { x: -796, y: -270, abbr: "MD" },
  Massachusetts: { x: 0, y: -404, abbr: "MA" },
  Michigan: { x: -134, y: -404, abbr: "MI" },
  Minnesota: { x: -268, y: -404, abbr: "MN" },
  Mississippi: { x: -399, y: -404, abbr: "MS" },
  Missouri: { x: -532, y: -404, abbr: "MO" },
  Montana: { x: -669, y: -404, abbr: "MT" },
  Nebraska: { x: -796, y: -404, abbr: "NE" },
  Nevada: { x: 0, y: -533, abbr: "NV" },
  NewHampshire: { x: -134, y: -533, abbr: "NH" },
  NewJersey: { x: -268, y: -533, abbr: "NJ" },
  NewMexico: { x: -399, y: -533, abbr: "NM" },
  NewYork: { x: -532, y: -533, abbr: "NY" },
  NorthCarolina: { x: -669, y: -533, abbr: "NC" },
  NorthDakota: { x: -796, y: -533, abbr: "ND" },
  Ohio: { x: 0, y: -668, abbr: "OH" },
  Oklahoma: { x: -134, y: -668, abbr: "OK" },
  Oregon: { x: -268, y: -668, abbr: "OR" },
  Pennsylvania: { x: -532, y: -668, abbr: "PA" },
  RhodeIsland: { x: -669, y: -668, abbr: "RI" },
  SouthCarolina: { x: -796, y: -668, abbr: "SC" },
  SouthDakota: { x: 0, y: -802, abbr: "SD" },
  Tennessee: { x: -134, y: -802, abbr: "TN" },
  Texas: { x: -268, y: -802, abbr: "TX" },
  Utah: { x: -399, y: -802, abbr: "UT" },
  Virginia: { x: -669, y: -802, abbr: "VA" },
  Washington: { x: -796, y: -802, abbr: "WA" },
  WestVirginia: { x: -18, y: -923, abbr: "WV" },
  Wisconsin: { x: -150, y: -923, abbr: "WI" },
  Wyoming: { x: -282, y: -923, abbr: "WY" },
};

let path = window.location.pathname;
let splitpath = path.split("/");
//get url path to obtain state name
let covidState = decodeURIComponent(splitpath[splitpath.length - 1]);
let stateNoSpace = covidState.split(" ").join("");
let time = moment().add(-2, "days").format("YYYY-MM-DD"); 
let healthDeptInfoArr = [];


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

function populateStateInfo() {
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

function getFlagInfo() {
  let backgroundLocation = stateFlagDetail[stateNoSpace];
  $("#flag-contain").css("background-image", "url(/images/state-flags.jpg)");
  $("#flag-contain").css(
    "background-position",
    `${backgroundLocation.x}px ${backgroundLocation.y}px`
  );
}

//get state covid sites
function stateCovidSite() {
  let stateAbbr = stateFlagDetail[stateNoSpace].abbr;

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
    healthDeptInfoArr.push(data);
  });
}

function displayHTML(dept) {
  let address;

  if (dept.address) {
    address = dept.address;
  } else {
    address = "";
  }
  let html = `<div class='local-dept'> <p>${dept.name}</p> <p>${dept.phone}</p><p>${address}</p><p><a href='${dept.website}' target='_blank'>${dept.website}</a></p></div>`;

  $(".state-dept-list").append(html);
}

function getHealthDept(state) {
  return $.ajax({
    url: `https://postman-data-api-templates.github.io/county-health-departments/api/${state}.json`,
    method: "GET",
  });
}

//county input filter
let input = document.getElementById("county-input");
input.addEventListener("input", function (e) {
  e.preventDefault();
  let healthDeptList = healthDeptInfoArr[0];
  let userInput = e.target.value.toLowerCase();

  let newDeptList = healthDeptList.filter((department) => {
    let deptNameLower = department.name.toLowerCase();
    let deptCheck = deptNameLower.indexOf(userInput);

    if (deptCheck > -1 && userInput.length > 1) {
      return department;
    }
  });

  $(".state-dept-list").empty();
  newDeptList.forEach((dept) => {
    displayHTML(dept);
  });
});
