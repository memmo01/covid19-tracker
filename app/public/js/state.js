let path = window.location.pathname;
let splitpath = path.split("/");
//get url path to obtain state name
let covidState = splitpath[splitpath.length - 1];
console.log(splitpath[splitpath.length - 1]);

//make call to server using state needing info on
$.ajax({ url: "/api/state/" + covidState, method: "get" }).then(function (
  stateData
) {
  populateData(stateData);
});

//dynamically populate info to the site
function populateData(stateData) {
  for (let key in stateData) {
    let title = $("<h2>");
    let li = $("<li>");
    title.text(key + ": " + stateData[key]);

    li.append(title);
    $(".state-general").append(li);
  }
}
