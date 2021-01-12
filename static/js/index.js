var table = d3.select("#table-ranking")
                .append('table')
                .attr("class","table table-striped table-sm");

var thead = table.append('thead');
var	tbody = table.append('tbody');

columns_names = ["Ranking","img","Team","MP","W","D","L","Pts"]
columns = ["#","","Team","MP","W","D","L","Pts"]

d3.json("/scrape").then((data)=>{
    
    //append the header row
    thead.append('tr')
    .style("background-color","whitesmoke")
    .selectAll('th')
    .data(columns)
        .enter()
    .append('th')
      .attr("class","font-weight-bold text-center")
      .style("color","rgba(35, 47, 52)")     
      .text(function (column) { return column; });
    
    // create a row for each object in the data
	var rows = tbody.selectAll('tr')
    .data(data)
        .enter()
    .append('tr');

    // create a cell in each row for each column
	var cells = rows.selectAll('td')
        .data(function (row) {
            return columns_names.map(function (column) {
                return {column: column, value: row[column]};
            })
        })
        .enter()
        .append('td')
            .attr("class",function(d){
                if (d.column === "Team" || d.column === "Pts"){
                    return "font-weight-bold text-center ";
                }
                return "text-center ";
            })
            .style("color","#f5f5f5")
            .text(function (d) { 
                if (d.column != "img"){
                    return d.value;
                } return ""})
            .attr("id",function (d) { 
                if (d.column != "img"){
                    return "stats";
                } return "club-logo"});

    var c = d3.selectAll("#club-logo")
            .append("img")
            .attr("src", function (d) { 
                if (d.column === "img"){
                    return d.value;
                    } 
                });
    }).catch(function(error) {
console.log(error);
});

