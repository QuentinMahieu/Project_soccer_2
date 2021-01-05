function makeResponsive() {
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").select("svg");
    // clear svg is not empty
    if (!svgArea.empty()) {
      svgArea.remove();
    }
    // SVG wrapper dimensions are determined by the current width and
    // height of the browser window.
    var svgWidth = (window.innerWidth)*.7;
    var svgHeight = (window.innerHeight)*.7;

    var margin = {
        top: 20,
        right: 10,
        bottom:90,
        left:125
    }
    var chartWidth = svgWidth - margin.right - margin.left;
    var chartHeight = svgHeight - margin.top - margin.bottom;
    
    //creates the svg wrapper and the chartgroup
    var svg = d3.select('#scatter')
                .append('svg')
                .attr('width',svgWidth)
                .attr('height',svgHeight)
    
    var chartGroup = svg.append('g')
                        .attr('transform', `translate(${margin.left},${margin.top})`);
                        
    //Initial Params
    var chosenXAxis = "Ranking";
    var chosenYAxis = "Goals+";
    ///creates the functions to create the new chart/////////
    //create Scales function
    function xScale(data,key){
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[key])-0.5,
            d3.max(data, d => d[key])+0.5])
        .range([0,chartWidth]);
        return xLinearScale;
    };
    function yScale(data,key){
        var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[key])-1,d3.max(data, d => d[key])+1.1])
        .range([chartHeight,0]);
        return yLinearScale;
    };
    //create Axis function
    function xAxes(xScale,xAxis){
        var bottomAxis = d3.axisBottom(xScale).ticks(12);
        xAxis.transition()
            .duration(1000)
            .call(bottomAxis);
        return xAxis;
    }
    function yAxes(yScale,yAxis){
        var leftAxis = d3.axisLeft(yScale).ticks(12);
        yAxis.transition()
            .duration(1000)
            .call(leftAxis);
        return yAxis;
    }
    //render circle and text function
    function renderCircles(circles, xLinearScale, chosenXAxis,yLinearScale,chosenYAxis) {
        circles.transition()
        .duration(1000)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]));
        return circles;
    }
    function renderTextCircles(textCirlces, xLinearScale, chosenXAxis,yLinearScale,chosenYAxis) {
        textCirlces.transition()
        .duration(1000)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]-0.2));
        return textCirlces;
    }
    // update tooltip function
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
        var xlabel;
        var ylabel;
        if (chosenXAxis === 'Ranking'){
            xlabel = "ranking:";
        }else if(chosenYAxis === "points"){
            xlabel = "Points:";
        } 
        if (chosenYAxis === 'possession'){
            ylabel = "Possesion:";
            var percent = "%";
        }else if(chosenYAxis === "passes") {
            ylabel = "Passes:";
            var percent = "%";
        }else if(chosenYAxis === "goals_againts"){ 
            ylabel = "Goals -:";
            var percent = "";
        }else{
            ylabel = "Goals +:";
            var percent = "";
        }
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([40, 70])
            .html(function(d){
                return (`${d.Teams}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}${percent}`);
        });
        circlesGroup.call(tip);
        circlesGroup.on('mouseover', function(d) {
            tip.show(d, this);
        })
        .on('mouseout', function(d) {
            tip.hide(d);
        }); 
        return circlesGroup;
    }
    d3.csv('data/team_player/cleaned_final/epl.csv').then((data,error)=>{
        if (error) throw error;
        //Format the data
        data.forEach((d)=>{
            d.Ranking = +d.Ranking;
            d.Year = +d.Year;
            d["Goals+"] = +d["Goals+"];
            d["Goals-"] = +d["Goals-"];
            d["Pass%"] = +d["Pass%"];
            d.Points = +d.Points;
            d.AerialsWon = +d.AerialsWon;
            d["Possession%"] = +d["Possession%"];
            d.RedCard = +d.RedCard;
            d["Shots pg"] = +d["Shots pg"];
            d.Teams = +d.Teams;
            d.Yellowcard = +d.Yellowcard;
            d["avg age"] = +d["avg age"];
            d["avg heights (cm)"] = +d["avg heights (cm)"];
            d["avg player rating"] = +d["avg player rating"];
            d["avg player value (EU)"] = +d["avg player value (EU)"];
            d["avg player wage"] = +d["avg player wage"];
            d["avg weight (kg)"] = +d["avg weight (kg)"];
            console.log(d["Goals-"])
        });
        
    ///creates the initial chart/////////
        // creates scales
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis])-0.5,
            d3.max(data, d => d[chosenXAxis])+0.5])
        .range([0,chartWidth]);
        var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis])-1,
            d3.max(data, d => d[chosenYAxis])+1.1])
        .range([chartHeight,0]);
        //creates the axis
        var bottomAxis = d3.axisBottom(xLinearScale).ticks(12);
        var leftAxis = d3.axisLeft(yLinearScale).ticks(12);
        //append axes
        var xAxis = chartGroup.append('g')
            .attr("transform",`translate(0,${chartHeight})`)
            .call(bottomAxis);
        var yAxis = chartGroup.append("g")
        .call(leftAxis);  
        // append circles
        var circlesGroups = chartGroup.selectAll("g circle")
            .data(data)
            .enter()
            .append("g");
    
        var circles = circlesGroups.append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", "10")
            .attr("fill", "#69b3a2")
            .attr("opacity",0.8)
            .attr("stroke-width", "1")
            .attr("stroke", "black");
        // append text
        var textCirlces = circlesGroups.append('text')
            .text(d => d.abbr)
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis]-0.2))
            .attr("font-family", "sans-serif")
            .attr("font-size", "11px")
            .attr("font-weight", "bold")
            .attr('text-anchor',"middle")
            .attr("fill", "white");
    
        //labels
        var xlabelsGroup = chartGroup.append('g')
            .attr('transform',`translate(${chartWidth/2},${chartHeight+20})`);
        var ylabelsGroup = chartGroup.append('g')
            .attr('transform',`translate(${-35},${chartHeight/2})`)
        var ranking = xlabelsGroup.append('text')
            .attr("x",0)
            .attr("y",20)
            .attr("value","ranking")
            .classed('active',true)
            .text("Ranking"); 
        var points = xlabelsGroup.append('text')
            .attr("x",0)
            .attr("y",40)
            .attr("value","points")
            .classed('inactive',true)
            .text("Points"); 
        var goals_for = ylabelsGroup.append('text')
            .attr("transform", "rotate(-90)")
            .attr("x",0)
            .attr('y',0)
            .attr("value","goals_for")
            .classed("active",true)
            .text("Goals +")
        var goals_against = ylabelsGroup.append('text')
            .attr("transform", "rotate(-90)")
            .attr("x",0)
            .attr('y',-25)
            .attr("value","goals_against")
            .classed("inactive",true)
            .text("Goals -")
        var possession = ylabelsGroup.append('text')
            .attr("transform", "rotate(-90)")
            .attr("x",0)
            .attr('y',-50)
            .attr("value","possession")
            .classed("inactive",true)
            .text("Possession (%)")
        var passes = ylabelsGroup.append('text')
            .attr("transform", "rotate(-90)")
            .attr("x",0)
            .attr('y',-75)
            .attr("value","passes")
            .classed("inactive",true)
            .text("Passes (%)")
    //initialise tooltip, call the tip and event usage
    updateToolTip(chosenXAxis,chosenYAxis,circlesGroups);
    //label event listener
    xlabelsGroup.selectAll('text')
    .on('click', function(){
        var value = d3.select(this).attr("value");   
        if (value !== chosenXAxis){
            chosenXAxis = value;
            xLinearScale = xScale(data, chosenXAxis);
            xAxis = xAxes(xLinearScale, xAxis);
            circles = renderCircles(circles,xLinearScale,chosenXAxis,yLinearScale,chosenYAxis);
            textCirlces = renderTextCircles(textCirlces,xLinearScale,chosenXAxis,yLinearScale,chosenYAxis)
            circlesGroups = updateToolTip(chosenXAxis,chosenYAxis,circlesGroups);
            if (chosenXAxis === "points") {
                points
                    .classed("active", true)
                    .classed("inactive", false);
                ranking
                    .classed("active", false)
                    .classed("inactive", true);
            }else {
                ranking
                    .classed("active", true)
                    .classed("inactive", false);
                points
                    .classed("active", false)
                    .classed("inactive", true);
            }
        }
    });
    ylabelsGroup.selectAll('text')
    .on('click', function(){
        var value = d3.select(this).attr("value");   
        if (value !== chosenYAxis){
            chosenYAxis = value;
            yLinearScale = yScale(data, chosenYAxis);
            yAxis = yAxes(yLinearScale, yAxis);
            circles = renderCircles(circles,xLinearScale,chosenXAxis,yLinearScale,chosenYAxis);
            textCirlces = renderTextCircles(textCirlces,xLinearScale,chosenXAxis,yLinearScale,chosenYAxis)
            circlesGroups = updateToolTip(chosenXAxis,chosenYAxis,circlesGroups);
            if (chosenYAxis === "goals_against") {
                goals_against
                    .classed("active", true)
                    .classed("inactive", false);
                goals_for
                    .classed("active", false)
                    .classed("inactive", true);
                possession
                    .classed("active", false)
                    .classed("inactive", true);
                passes
                    .classed("active", false)
                    .classed("inactive", true);
            }else if (chosenYAxis === "possession") {
                goals_against
                    .classed("active", false)
                    .classed("inactive", true);
                goals_for
                    .classed("active", false)
                    .classed("inactive", true);
                possession
                    .classed("active", true)
                    .classed("inactive", false);
                passes
                    .classed("active", false)
                    .classed("inactive", true);
            }else if (chosenYAxis === "passes") {
                goals_against
                    .classed("active", false)
                    .classed("inactive", true);
                goals_for
                    .classed("active", false)
                    .classed("inactive", true);
                possession
                    .classed("active", false)
                    .classed("inactive", true);
                passes
                    .classed("active", true)
                    .classed("inactive", false);
            }else {
                goals_against
                    .classed("active", false)
                    .classed("inactive", true);
                goals_for
                    .classed("active", true)
                    .classed("inactive", false);
                possession
                    .classed("active", false)
                    .classed("inactive", true);
                passes
                    .classed("active", false)
                    .classed("inactive", true);
            }
        }
    });
}).catch(function(error) {
    console.log(error);
    });
}
makeResponsive();

d3.select(window).on("resize", makeResponsive);
