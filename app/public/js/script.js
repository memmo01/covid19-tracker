
let layer;
let statesData;
let time = moment().add(-2, "days").format("YYYY-MM-DD");
let mapZoom;
let clickZoom;

//adjust zoom level of map depending on the screen size
window.innerWidth < 600
  ? (mapZoom = 3) && (clickZoom = 4)
  : (mapZoom = 4) && (clickZoom = 5);
window.innerWidth < 600;

//creates map and places the view in the center of the country
var mymap = L.map("mapid").setView([38.3, -98.79], mapZoom);

const attribution =
  "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>";
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
L.tileLayer(tileUrl, { attribution }).addTo(mymap);
getCovidNews();
getUSAData();

function getUSAData() {
  $.ajax({
    url: "/api/covidUSATotals",
    method: "post",
    data: { date: time },
  }).then(function (data) {
    appendCaseData("USA", data, data, "../images/country-flags.png");
  });
}

$.ajax({ url: "/api/stateDataSorted", method: "get" }).then(function (Data) {
  statesData = Data;
  startApp();
});

function startApp() {
  $(".load-container >.loader").removeClass("show");
  L.geoJson(statesData);
  styleData();
}

//based on information in the statesData object feature.properties.cases), get color will change the background color of the state
function getColor(d) {
  return d > 150000
    ? "#b10026"
    : d > 100000
      ? "#e31a1c"
      : d > 50000
        ? "#fc4e2a"
        : d > 25000
          ? "#fd8d3c"
          : d > 10000
            ? "#feb24c"
            : d > 5000
              ? "#fed976"
              : d > 1000
                ? "#ffeda0"
                : "blue";
}

function styleData() {
  L.geoJson(statesData, { style: style }).addTo(mymap);
}
//based on what the user is searching : the feature.properties. whatever can be changed. (daily death, daily increase, total deaths, total cases)
function style(feature) {
  return {
    fillColor: getColor(feature.properties.cases),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "2",
    fillOpacity: 0.7,
  };
}

//when map is clicked grab the lat and lng. then find out what state it is in. then make a call to the covid database. get information about that state and append it to the marker popup and zoom in on that state

function onMapClick(e) {
  $("#state-container").empty();

  let loader = $("<div>");
  loader.addClass("loader show");
  $("#state-container").append(loader);

  let lat = e.latlng.lat;
  let lng = e.latlng.lng;

  let state;
  if (layer) {
    layer.remove();
  }

  mymap.flyTo(new L.LatLng(lat, lng), clickZoom);
  checkGeo(lat, lng).then(function (response) {
    state = response.results[0].region;

    checkCovid(state).then(function (response) {
      let inUS = updateCovidStateHTML(state, response.data);

      if (inUS) {
        layer = L.marker([lat, lng]);
        layer.addTo(mymap);
      }
    });
  });
}

function checkCovid(state) {
  return $.ajax({
    method: "post",
    url: "/api/checkcovid",
    data: { state: state, time: time },
    timeout: 3000,
    error: function (xmlhttprequest, textstatus) {
      if (textstatus === "timeout") {
        alert("page timedout");
        location.reload();
      } else {
        alert(textstatus);
      }
    },
  }).then(function (data) {
    return data;
  });
}

function checkGeo(lat, lng) {
  return $.ajax({
    url: "/api/checkgeo",
    method: "post",
    data: { lat: lat, lng: lng },
  });
}

mymap.on("click", onMapClick);
mymap.on("dblclick", function () {
  mymap.flyTo(new L.LatLng(38.3, -98.79), 4);
  if (layer) {
    layer.remove();
  }
});

function updateCovidStateHTML(state, data) {

  $("#state-container >.loader").removeClass("show");
  let selected = statesData.features.filter(function (item) {
    if (item.properties.name === state) {
      return item;
    }
  });
  if (selected.length > 0) {
    appendCaseData(state, selected[0], data[0]);
    return true;
  } else {
    let newSelectionH1El = $("<h2>").text(
      "Please select a state in the United States"
    );
    $("#state-container").append(newSelectionH1El);
    return false;
  }
}

function appendCaseData(state, selected, data, img) {
  let backgroundImg;
  img == null
    ? (backgroundImg = "/images/state-flags.jpg")
    : (backgroundImg = img);
  let stateH1El = $("<h1>").text(state);
  let flagContain = $("<div>");
  flagContain.attr("id", "flag-contain");
  flagContain.css("background-image", `url(${backgroundImg})`);
  flagContain.css(
    "background-position",
    `${selected.css.x}px ${selected.css.y}px`
  );
  let ulEl = $("<ul>");
  ulEl.attr("id", "state-data");
  let list = `<li id="state-date"><p>*As of :${data.date}</p></li>
          <li><p>${data.confirmed.toLocaleString()}</p><div class="data-title">Total Cases </h3> </li>
          <div class="separate-line"></div>
            <li><p>${data.deaths.toLocaleString()}</p><div class="data-title">Confired Deaths </div > </li>
            <div class="separate-line"></div>
            <li><p> ${data.deaths_diff.toLocaleString()}</p><div class="data-title">Confirmed Deaths Compared to Previous Day </div></li>
            <div class="separate-line"></div>
          <li><p> ${data.confirmed_diff.toLocaleString()}</p><div class="data-title">Confirmed Cases Compared to Previous Day </div></li>
          `;

  if (state !== "USA") {
    list += `<a href="/state/${state}" id="state-detail-link" >State Details</a>`;
  }

  ulEl.append(list);

  $("#state-container").append(flagContain, stateH1El, ulEl);
}

function getCovidNews() {
  $.get("/api/covidnews", function (data) {
    populateCovidNews(data);
  });
}

// create an html element to contain the covid news list
function populateCovidNews(data) {
  let covidContainer = $("<div>");
  covidContainer.addClass("covid-container");
  let h1EL = $("<h1>");
  h1EL.text("Covid-19 News");
  covidContainer.append(h1EL);

  data.forEach((newsSection, i) => {
    //show 10 articles
    if (i < 10) {
      let html = covidNewsHTML(newsSection);
      covidContainer.append(html);
    }
  });

  $("#news").append(covidContainer);
}

function covidNewsHTML(newsSection) {
  let img;
  // if there is an image in the api, set it to the img variable, if not then set the image source as #
  if (newsSection.images) {
    img = newsSection.images[0].url;
  } else {
    img = "../images/blank-image-covid.jpg";
  }

  // covid news html structure
  let html = `<li> 
   <a href=${newsSection.webUrl} target="_blank" class="img-link">
   <img src=${img} />
   </a>
   <article class="news-details">
   <a href=${newsSection.webUrl} target="_blank"><h2>${newsSection.title}</h2>
   <p>${newsSection.excerpt}</p>
   </a>

   <div class="news-name">${newsSection.provider.name}</div>
   </article>

   </li>`;
  return html;
}
