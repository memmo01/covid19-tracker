google.charts.load("current", { packages: ["line"] });
function drawChart(graphData) {
  var data = new google.visualization.DataTable();
  data.addColumn("date", "Time Of Day");
  data.addColumn("number", "Total Cases");
  data.addRows(graphData);

  var options = {
    chart: {
      title: "Covid Data the Past 5 Days",
      subtitle: "United States",
    },
    height: 300,
    width: 600,
    hAxis: {
      format: "M/d/yy",
    },
    vAxis: {
      title: "Number Confirmed",
    },
  };

  var chart = new google.charts.Line(document.getElementById("USA-five-day"));

  chart.draw(data, google.charts.Line.convertOptions(options));
}

getLastFiveDates();

//make a call to the covid api and get the last 5 days worth of data sent back
//loop through the data pushing it to an array within the loop
//include date, confirmed deaths, and confirmed cases
//push that array to a main array within the function
// return main array

function getLastFiveDates() {
  return $.ajax({
    url: "/api/covidFiveDay",
    method: "get",
  }).then(function (data) {
    let graphData = [];

    data.forEach((item) => {
      graphData.push([new Date(item.date), item.confirmed]);
    });
    console.log(graphData);

    google.charts.setOnLoadCallback(drawChart(graphData));
  });
}
