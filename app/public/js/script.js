let time = moment().add(-1, "days").format("YYYY-MM-DD");
console.log(time);
//creates map and places the view in the center of the country
var mymap = L.map("mapid").setView([38.3, -98.79], 4);

let marker;
let layer;
var mapboxAccessToken = "";
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=" +
    mapboxAccessToken,
  {
    id: "mapbox/light-v9",
    tileSize: 512,
    zoomOffset: -1,
  }
).addTo(mymap);

//statesData is an object grabbed from the state.js file which outlines the state borders
L.geoJson(statesData);

//based on information in the statesData object feature.properties.density), get color will change the background color of the state
function getColor(d) {
  return d > 1000
    ? "#800026"
    : d > 500
    ? "#BD0026"
    : d > 200
    ? "#E31A1C"
    : d > 100
    ? "#FC4E2A"
    : d > 50
    ? "#FD8D3C"
    : d > 20
    ? "#FEB24C"
    : d > 10
    ? "#FED976"
    : "#FFEDA0";
}

//based on what the user is searching : the feature.properties. whatever can be changed. (daily death, daily increase, total deaths, total cases)
function style(feature) {
  return {
    fillColor: getColor(feature.properties.density),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "2",
    fillOpacity: 0.7,
  };
}
L.geoJson(statesData, { style: style }).addTo(mymap);

//when map is clicked grab the lat and lng. then find out what state it is in. then make a call to the covid database. get information about that state and append it to the marker popup and zoom in on that state
let preventDblClick = 0;
function onMapClick(e) {
  $("#state-container").empty();

  let loader = $("<div>");
  loader.addClass("loader show");
  preventDblClick++;
  $("#state-container").append(loader);
  if (preventDblClick > 1) {
    return;
  } else {
    let lat = e.latlng.lat;
    let lng = e.latlng.lng;

    let state;
    if (layer) {
      layer.remove();
    }

    mymap.flyTo(new L.LatLng(lat, lng), 6);
    checkGeo(lat, lng).then(function (response) {
      state = response.results[0].region;

      checkCovid(state).then(function (r) {
        console.log("HERE");
        console.log(r.data);
        updateCovidStateHTML(state, r.data);
        console.log(r.data);

        layer = L.marker([lat, lng]);
        layer
          .addTo(mymap)
          .bindPopup(
            "<h1>" +
              state +
              "</h1><p>confirmed cases: " +
              r.data[0].confirmed +
              "</p>"
          )
          .openPopup();
        preventDblClick = 0;
      });
    });
  }
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
  console.log(state + data);
  $("#state-container >.loader").removeClass("show");
  let selected = statesData.features.filter(function (item) {
    if (item.properties.name === state) {
      console.log("winner");

      return item;
    }
  });

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
  let list = `<li id="state-date"><p>As of:${data[0].date}</p></li>
          <li><p>${data[0].confirmed}</p><div class="data-title">Total Cases </h3> </li>
            <li><p>${data[0].deaths}</p><div class="data-title">Confired Deaths </div > </li>
            <li><div class="data-title">Confirmed Deaths Compared to Previous Day: </div><p> ${data[0].deaths_diff}</p></li>
          <li><h3>Confirmed Cases Compared to Previous Day: </h3><p> ${data[0].confirmed_diff}</p></li>
          
          `;

  ulEl.append(list);

  $("#state-container").append(flagContain, stateH1El, ulEl);
}
