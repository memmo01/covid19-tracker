let marker;
let layer;
let statesData;
let time = moment().add(-2, "days").format("YYYY-MM-DD");

//creates map and places the view in the center of the country
var mymap = L.map("mapid").setView([38.3, -98.79], 4);

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
L.tileLayer(tileUrl, { attribution }).addTo(mymap);

$.ajax({ url: "/api/getstuff", method: "get" }).then(function (Data) {
  statesData = Data;
  startApp();
});

function startApp() {
  console.log(statesData);
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
    : "#ffffcc";
}

function styleData() {
  console.log(L.geoJson);
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
let preventDblClick = 0;
function onMapClick(e) {
  $("#state-container").empty();

  let loader = $("<div>");
  loader.addClass("loader show");
  preventDblClick++;
  $("#state-container").append(loader);

  let lat = e.latlng.lat;
  let lng = e.latlng.lng;

  let state;
  if (layer) {
    layer.remove();
  }

  mymap.flyTo(new L.LatLng(lat, lng), 6);
  checkGeo(lat, lng).then(function (response) {
    state = response.results[0].region;

    checkCovid(state).then(function (response) {
      let inUS = updateCovidStateHTML(state, response.data);
      if (inUS) {
        layer = L.marker([lat, lng]);
        layer
          .addTo(mymap)
          .bindPopup(
            "<h1>" +
              state +
              "</h1><p>confirmed cases: " +
              response.data[0].confirmed +
              "</p>"
          )
          .openPopup();
      }
      preventDblClick = 0;
    });
  });
}

function checkCovid(state) {
  return $.ajax({
    method: "post",
    url: "/api/checkcovid",
    data: { state: state, time: time },
  }).then(function (data) {
    return data;
  });
}

function checkGeo(lat, lng) {
  return $.ajax({
    url: "/api/checkgeo",
    method: "post",
    data: { lat: lat, lng: lng },
  }).then(function (data) {
    return data;
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
    let stateH1El = $("<h1>").text(state);
    let flagContain = $("<div>");
    flagContain.attr("id", "flag-contain");
    flagContain.css("background-image", `url(/images/state-flags.jpg)`);
    flagContain.css(
      "background-position",
      `${selected[0].css.x}px ${selected[0].css.y}px`
    );
    let ulEl = $("<ul>");
    ulEl.attr("id", "state-data");
    let list = `<li id="state-date"><p>*As of :${data[0].date}</p></li>
          <li><p>${data[0].confirmed}</p><div class="data-title">Total Cases </h3> </li>
          <div class="separate-line"></div>
            <li><p>${data[0].deaths}</p><div class="data-title">Confired Deaths </div > </li>
            <div class="separate-line"></div>
            <li><p> ${data[0].deaths_diff}</p><div class="data-title">Confirmed Deaths Compared to Previous Day </div></li>
            <div class="separate-line"></div>
          <li><p> ${data[0].confirmed_diff}</p><div class="data-title">Confirmed Cases Compared to Previous Day </div></li>
          
          `;

    ulEl.append(list);

    $("#state-container").append(flagContain, stateH1El, ulEl);
    return true;
  } else {
    let newSelectionH1El = $("<h2>").text(
      "Please select a state in the United States"
    );
    $("#state-container").append(newSelectionH1El);
    return false;
  }
}
