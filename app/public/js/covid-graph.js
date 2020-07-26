let covidCasesData = [];
let covidDeaths = [];

//changes size of charts based on screen size
$(window).resize(function (e) {
  console.log(e);
  let width = $(".chart").width() - 10;
  google.charts.setOnLoadCallback(
    drawChart(
      covidCasesData,
      "usa-cases-five-day",
      "Covid Cases the Past 5 Days",
      width
    )
  );
  google.charts.setOnLoadCallback(
    drawChart(
      covidDeaths,
      "usa-five-day-deaths",
      "Covid Deaths the Past 5 Days",
      width
    )
  );
});

//load chart info
google.charts.load("current", { packages: ["line"] });

// create chart
function drawChart(graphData, location, graphTitle, newWidth) {
  var data = new google.visualization.DataTable();
  data.addColumn("date", "Time Of Day");
  data.addColumn("number", "Total Cases");
  data.addRows(graphData);

  var options = {
    chart: {
      title: graphTitle,
      subtitle: "United States",
    },
    width: newWidth,
    height: 300,
    hAxis: {
      format: "M/d/yy",
    },
    vAxis: {
      title: "Number Confirmed",
    },
  };

  var chart = new google.charts.Line(document.getElementById(location));

  chart.draw(data, google.charts.Line.convertOptions(options));
}

getLastFiveDates();

//get data to load into chart
function getLastFiveDates() {
  return $.ajax({
    url: "/api/covidFiveDay",
    method: "get",
  }).then(function (data) {
    data.forEach((item) => {
      covidCasesData.push([new Date(item.date), item.confirmed]);
      covidDeaths.push([new Date(item.date), item.deaths]);
    });

    google.charts.setOnLoadCallback(
      drawChart(
        covidCasesData,
        "usa-cases-five-day",
        "Covid Cases the Past 5 Days"
      )
    );
    google.charts.setOnLoadCallback(
      drawChart(
        covidDeaths,
        "usa-five-day-deaths",
        "Covid Deaths the Past 5 Days"
      )
    );
  });
}
