function init(country, year, measure) {
  buildHero(country);
  buildTable(country, year, measure);
  buildChart(country, year, measure);
}

function buildHero(country) {
  // Load in the data
  d3.json("/financials/hero/data").then((data, error) => {
    if (error) throw error;
    // Log the country selected in the dropdown
    var country = d3.select("#league").node().value;
    // Use to filter the dataset

    data = data.filter((d) => d.League == country);
    //Format the data and prepare for it to be plotted
    transfer = [];
    year = [];
    data.forEach((d) => {
      d.Transfer_spend = +d.Transfer_Spend;
      year.push(d.year);
      transfer.push(d.Transfer_Spend);
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

function buildChart(country, year, measure) {
  var country = d3.select("#league").node().value;
  var year = d3.select("#year").node().value;
  var measure = d3.select("#measure").node().value;

  d3.json(`/financials/comparison/data`).then((data2, error) => {
    data2 = data2.filter((d) => d.League == country);
    data2 = data2.filter((d) => d.Year == year);

    var league_average = 0;
    var top_4 = 0;
    var bottom_4 = 0;

    function graphData(group) {
      data = data2.filter((d) => d.Group == group);
      var league_transfer_spend = 0;
      var league_wages = 0;
      var league_player_value = 0;
      data.forEach((d) => {
        league_transfer_spend = d.Transfers;
        league_wages = d.Wages;
        league_player_value = d.Value;
      });

      var value = 0;
      if (measure == "Wages") {
        value = league_wages;
      } else if (measure == "Transfers") {
        value = league_transfer_spend;
      } else if (measure == "Value") {
        value = league_player_value;
      }
      return value;
    }
    var top4 = graphData("Top 4");
    var bottom4 = graphData("Bottom 4");
    var league = graphData("League");

    values = [top4, league, bottom4];
    labels = ["Top 4", "League Average", "Bottom 4"];
    console.log(values);
    var trace = {
      x: labels,
      y: values,
      type: "bar",
    };
    var data = [trace];
    var layout = {
      title: "Comparison",
    };
    d3.select("#comparison").append("div").attr("id", "comparison_chart");

    // Build plot for Hero graph
    Plotly.newPlot("comparison_chart", data, layout);
  });
}

function buildTable(country, year, measure) {
  d3.json(`/financials/top4/data`).then((data, error) => {
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
    player_value = [];
    data.forEach((d) => {
      teams.push(d.Team);
      position.push(d.Ranking);
      transfer_spend.push(d.Transfer_spend);
      wages.push(d.Player_Wages);
      player_value.push(d.Average_Player_Value);
    });

    if (measure == "Wages") {
      financials = wages;
      title = "Avg. Player Wages";
    } else if (measure == "Transfers") {
      financials = transfer_spend;
      title = "Average Transfer Spend";
    } else if (measure == "Value") {
      financials = player_value;
      title = "Average Player Value";
    }

    d3.json(`/financials/comparison/data`).then((data2, error) => {
      data2 = data2.filter((d) => d.League == country);
      data2 = data2.filter((d) => d.Year == year);
      data2 = data2.filter((d) => d.Group == "Top 4");

      league_transfer_spend = [];
      league_wages = [];
      league_player_value = [];
      data2.forEach((d) => {
        league_transfer_spend.push(d.Transfers);
        league_wages.push(d.Wages);
        league_player_value.push(d.Value);
      });

      if (measure == "Wages") {
        averaged = league_wages;
      } else if (measure == "Transfers") {
        averaged = league_transfer_spend;
      } else if (measure == "Value") {
        averaged = league_player_value;
      }
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
      } else if (measure == "Value") {
        player_value.forEach((d) => {
          var subtract = d - averaged;
          subtract = +subtract;
          difference.push(subtract);
        });
      }

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
  d3.select("#comparison_chart").remove();
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

init("England", "2016", "Wages");
