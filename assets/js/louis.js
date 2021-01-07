function init(country, year, measure) {
  buildHero(country);
  buildTable(country, year, measure);
}

function buildHero(country) {
  // Load in the data
  d3.csv(`Test_transfer.csv`).then((data, error) => {
    if (error) throw error;
    // Log the country selected in the dropdown
    var country = d3.select("#league").node().value;
    // Use to filter the dataset
    data = data.filter((d) => d.League == country);
    //Format the data and prepare for it to be plotted
    transfer = [];
    year = [];
    data.forEach((d) => {
      d.Transfer_spend = +d.Transfer_spend;
      year.push(d.Year);
      transfer.push(d.Transfer_spend);
    });
    // Set up parameters for Plotly
    var trace = {
      x: year,
      y: transfer,
      type: "bar",
    };
    var data = [trace];
    var layout = {
      title: "Transfer spend over time",
    };
    // Build plot for Hero graph
    Plotly.newPlot("plot", data, layout);

    // Adding in a custom paragraph based on which country has been selected.
    var transfer_change = transfer[transfer.length - 1] - transfer[0];
    d3.select("#transfer_analysis")
      .append("p")
      .attr("id", "transfer_copy")
      .text(
        `In ${country}, from 1990 to 2020, we there has been an increase of $${transfer_change}`
      );
  });
}

function buildTable(country, year, measure) {
  d3.csv(`Test_table.csv`).then((data, error) => {
    if (error) throw error;
    // Log the country selected in the dropdown
    var country = d3.select("#league").node().value;
    var year = d3.select("#year").node().value;
    var measure = d3.select("#measure").node().value;
    // Use to filter the dataset
    data = data.filter((d) => d.League == country);
    data = data.filter((d) => d.Year == year);
    //Format the data and prepare for it to be plotted
    teams = [];
    position = [];
    transfer_spend = [];
    wages = [];
    data.forEach((d) => {
      teams.push(d.Team);
      position.push(d.Position);
      transfer_spend.push(d.Transfer_spend);
      wages.push(d.Player_Wages);
    });
    if (measure == "Wages") {
      financials = wages;
      title = "Avg. Player Wages (Euros)";
    } else if (measure == "Transfers") {
      financials = transfer_spend;
      title = "3 Yr MA Transfer Spend (Euros)";
    }

    d3.csv(`Test_graph.csv`).then((data2, error) => {
      data2 = data2.filter((d) => d.League == country);
      data2 = data2.filter((d) => d.Year == year);
      data2 = data2.filter((d) => d.Measure == measure);

      averaged = 0;
      data2.forEach((d) => {
        averaged = d.League_Average;
      });
      console.log(averaged);
      d3.select("#average")
        .append("p")
        .attr("id", "average_copy")
        .text(
          `The league average for ${title} in ${country} in ${year} was €${averaged}.`
        );
      difference = [];

      if (measure == "Wages") {
        wages.forEach((d) => {
          var subtract = d - averaged;
          subtract = +subtract;
          difference.push(subtract);
        });
      } else if (measure == "Transfers") {
        transfer_spend.forEach((d) => {
          var subtract = d - averaged;
          subtract = +subtract;
          difference.push(subtract);
        });
      }

      console.log(difference);
      var values = [position, teams, financials, difference];

      var data = [
        {
          type: "table",
          header: {
            values: [
              ["<b>Position</b>"],
              ["<b>Team</b>"],
              [`<b>${title}</b>`],
              [`<b>vs. League average </b>`],
            ],
            align: ["center"],
            line: { width: 1, color: "#506784" },
            fill: { color: "#119DFF" },
            font: { family: "Arial", size: 12, color: "white" },
          },
          cells: {
            values: values,
            align: ["center"],
            line: { color: "#506784", width: 1 },
            fill: { color: ["#d3d3d3", "white"] },
            font: { family: "Arial", size: 11, color: ["#506784"] },
          },
        },
      ];

      Plotly.newPlot("table", data);
    });
  });
}

function getColor(d) {
  return d > 100000
    ? "#800026"
    : d > 5
    ? "#BD0026"
    : d > 4
    ? "#E31A1C"
    : d > 3
    ? "#FC4E2A"
    : d > 2
    ? "#FD8D3C"
    : d < 0
    ? "#FEB24C"
    : d < -10000
    ? "#FED976"
    : "#FFEDA0";
}

var selection = d3.select("#league");
selection.on("change", updateData);
var selected = d3.select("#measure");
selected.on("change", updateData);
var year_selected = d3.select("#year");
year_selected.on("change", updateData);

function updateData() {
  d3.select("plot").remove();
  d3.select("#transfer_copy").remove();
  d3.select("#average_copy").remove();
  var value = d3.select("#league").node().value;
  if (value === "Spain") {
    country = value;
  } else if (value === "Italy") {
    country = value;
  } else {
    country = value;
  }
  var measure = d3.select("#measure").node().value;
  var year = d3.select("#year").node().value;
  init(country, year, measure);
}

init("England", "2019", "Wages");
