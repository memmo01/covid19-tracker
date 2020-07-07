let path = window.location.pathname;
let splitpath = path.split("/");
let covidState = splitpath[splitpath.length - 1];
console.log(splitpath[splitpath.length - 1]);

$.ajax({ url: "/api/state/" + covidState, method: "get" }).then(function (
  stateData
) {
  console.log(stateData);
});
