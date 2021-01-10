function makeResponsive() {
    // remove it and replace it with a resized version of the chart
    var svgArea = d3.select("body").selectAll("svg");
    // clear svg if not empty
    svgArea.remove();
  
    var svgWidth = (window.innerWidth)*.9;
    var svgHeight = (window.innerHeight)*.7;
    var margin = {
        top: 20,
        right: 20,
        bottom:90,
        left:180
        }
    var chartWidth = svgWidth - margin.right - margin.left;
    var chartHeight = svgHeight - margin.top - margin.bottom

        //creates the svg wrapper and the chartgroup
    var svg = d3.select('#scatter')
            .append('svg')
            .attr('width',svgWidth)
            .attr('height',svgHeight)     
                         
    //Initial Params
    var chosenXAxis = "Ranking";
    var chosenYAxis = "Goals+";
    var country = "England";
    ///creates the functions to create the new chart/////////
    //init functions Scales function for init
    function xScale(data,chosenXAxis){
        var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis])-0.5,
            d3.max(data, d => d[chosenXAxis])+0.5])
        .range([0,chartWidth]);
        return xLinearScale;
    };
    function yScale(data,chosenYAxis){
        var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis])-1,
            d3.max(data, d => d[chosenYAxis])+1.1])
        .range([chartHeight,0]);
        return yLinearScale;
    };
    function initXAxis(xLinearScale,chartGroup){
        var bottomAxis = d3.axisBottom(xLinearScale).ticks(12);
        var xAxis = chartGroup.append('g')
            .attr("transform",`translate(0,${chartHeight})`)
            .style("color","white")
            .call(bottomAxis);
        return xAxis
    };
    function initYAxis(yLinearScale,chartGroup){
        var leftAxis = d3.axisLeft(yLinearScale).ticks(12);
        var yAxis = chartGroup.append("g")
            .style("color","white")
            .call(leftAxis);
        return yAxis
    };
    function createCirclesGroup(data,chartGroup){
        var circlesGroups = chartGroup.selectAll("g circle")
            .data(data)
            .enter()
            .append("g");
        return circlesGroups
    }
    function makeCircles(circlesGroups,xLinearScale,yLinearScale){
        var circles = circlesGroups.append("circle")
        .attr('class', d=>"y" + d.Year)
        .attr("cx", d => (d[chosenXAxis] ==="") ? 0 :xLinearScale(d[chosenXAxis]))
        .attr("cy", d => (d[chosenYAxis] ==="") ? 0 :yLinearScale(d[chosenYAxis]))
        .attr("r", "10")
        .attr("fill", d => getColor(d.Year))
        .attr("opacity",d => (d[chosenYAxis] ===0) ? 0 :0.7)
        .attr("stroke-width", d => (d[chosenYAxis] ===0) ? "0" :"1")
        .attr("stroke", "white");
        return circles
    }
    //update functions create Axis function to for the update
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
        .attr("cx", d => (d[chosenXAxis] ==="") ? 0 :xLinearScale(d[chosenXAxis]))
        .attr("cy", d => (d[chosenYAxis] ==="") ? 0 :yLinearScale(d[chosenYAxis]))
        .attr("opacity",d => (d[chosenYAxis] ===0) ? 0 :0.7)
        .attr("stroke-width", d => (d[chosenYAxis] ===0) ? "0" :"1")
        .attr("stroke", "white");;
        return circles;
    }
    //creates color and opacity functions per year of data 
    function getColor(d){
        switch(d){
            case 2019: 
                return "#bd1905";
            case 2018:
                return "#dc2f02";
            case 2017:
                return "#e85d04";
            case 2016:
                return "#f48c06";
            case 2015:
                return "#ffba08";
            case 2014:
                return "#ffd056";
            default:
                return "#6a040f"; 
        }
    }
    // update tooltip function
    function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
        var xlabel;
        var ylabel;
        if (chosenXAxis === 'Ranking'){
            xlabel = "Ranking: ";
        }else if(chosenXAxis === "Points"){
            xlabel = "Points: ";
        } 
        if (chosenYAxis === 'Possession%'){
            ylabel = "Possesion: ";
            var percent = "%";
        }else if(chosenYAxis === "Pass%") {
            ylabel = "Passes: ";
            var percent = "%";
        }else if(chosenYAxis === "MA"){ 
            ylabel = "Moving average: ";
            var percent = "";
        }else if(chosenYAxis === "Shots pg"){ 
            ylabel = "Shots per game : ";
            var percent = "";
        }else if(chosenYAxis === "avg player rating"){ 
            ylabel = "avg player rating : ";
            var percent = "%";
        }else{
            ylabel = "Goals +: ";
            var percent = "";
        }
        var tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([40, 70])
            .html(function(d){
                return (`<strong>${d.Teams}</strong><hr>${xlabel}${d[chosenXAxis]}<br>${ylabel}${d[chosenYAxis]}${percent}`);
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

    var selection = d3.select(".league");
    selection.on("change",updateData)

    function updateData(){
        d3.select(".scatterplot")
            .remove();
        var value =d3.select(".league").node().value;
        if (value === "Spain"){
            country = value;
        }else if (value === "Italy"){
            country = value;
        }else{
            country = value;
        }
        init(country);
    }
        //load the data
    function init(country){
        var chartGroup = svg.append('g')
            .attr('class', "scatterplot")
            .attr('transform', `translate(${margin.left},${margin.top})`);
            
        d3.csv(`../data/team_player/cleaned_final/leagues.csv`).then((data,error)=>{
            if (error) throw error;
            data = data.filter(d=> d.Country == country)
            //Format the data
            data.forEach((d)=>{
                d.Ranking = +d.Ranking;
                d.Year = +d.Year;
                d["MA"] = +d["MA"];
                d["Shots pg"] = +d["Shots pg"];
                d["Goals+"] = +d["Goals+"];
                d["Goals-"] = +d["Goals-"];
                d["Pass%"] = +d["Pass%"];
                d.Points = +d.Points;
                d["Possession%"] = +d["Possession%"];
                d["avg player rating"] = +d["avg player rating"];
            });
        ///creates the initial chart/////////
            // creates scales
            var xLinearScale = xScale(data,chosenXAxis);
            var yLinearScale = yScale(data,chosenYAxis);
            //append axes
            var xAxis = initXAxis(xLinearScale,chartGroup);
            var yAxis = initYAxis(yLinearScale,chartGroup);  
            // append circles
            var circlesGroups = createCirclesGroup(data,chartGroup);
            var circles = makeCircles(circlesGroups,xLinearScale,yLinearScale);
            //labels
            var xlabelsGroup = chartGroup.append('g')
                .attr('transform',`translate(${chartWidth/2},${chartHeight+20})`);
            var ylabelsGroup = chartGroup.append('g')
                .attr('transform',`translate(${-35},${chartHeight/2})`)
            var ranking = xlabelsGroup.append('text')
                .attr("x",0)
                .attr("y",20)
                .attr("value","Ranking")
                .classed('active',true)
                .text("Ranking"); 
            var points = xlabelsGroup.append('text')
                .attr("x",0)
                .attr("y",40)
                .attr("value","Points")
                .classed('inactive',true)
                .text("Points"); 
            var goals_for = ylabelsGroup.append('text')
                .attr("transform", "rotate(-90)")
                .attr("x",0)
                .attr('y',0)
                .attr("value","Goals+")
                .classed("active",true)
                .text("Goals +")
            var player_rating = ylabelsGroup.append('text')
                .attr("transform", "rotate(-90)")
                .attr("x",0)
                .attr('y',-20)
                .attr("value","avg player rating")
                .classed("inactive",true)
                .text("avg player rating")
            var possession = ylabelsGroup.append('text')
                .attr("transform", "rotate(-90)")
                .attr("x",0)
                .attr('y',-40)
                .attr("value","Possession%")
                .classed("inactive",true)
                .text("Possession (%)")
            var passes = ylabelsGroup.append('text')
                .attr("transform", "rotate(-90)")
                .attr("x",0)
                .attr('y',-60)
                .attr("value","Pass%")
                .classed("inactive",true)
                .text("Passes (%)")
            var movingAverage = ylabelsGroup.append('text')
                .attr("transform", "rotate(-90)")
                .attr("x",0)
                .attr('y',-80)
                .attr("value","MA")
                .classed("inactive",true)
                .text("Moving average transfer spend")
            var shots = ylabelsGroup.append('text')
                .attr("transform", "rotate(-90)")
                .attr("x",0)
                .attr('y',-100)
                .attr("value","Shots pg")
                .classed("inactive",true)
                .text("Shots per game")
            // legend
            var legend = chartGroup.append("g")
                .attr('transform',`translate(${chartWidth-60},-5)`)
                .attr("class","legendScatter");

            var legendSpacing = 15;
            var years = [2014,2015,2016,2017,2018,2019,2020]
            legend.append("text")
                    .attr("id","all")
                    .style("fill","white")
                    .attr("x", -7)
                    .attr("y",0)
                    .text('All Years');
            for (var i=0; i<years.length;i++){
                legend.append('circle')
                .attr("class",`y${years[i]}`)
                .attr("cx", 0)
                .attr("cy", -2 + legendSpacing)
                .attr("r", "5")
                .attr("fill", getColor(years[i]))
                .attr("opacity","0.7")
                .attr("stroke-width", "1")
                .attr("stroke", "white");
                legend.append("text")
                    .attr("id",`t${years[i]}`)
                    .style("fill","white")
                    .attr("x", 10)
                    .attr("y",3+ legendSpacing)
                    .text(years[i]);
                legendSpacing += 15;
            }
        //initialise tooltip, call the tip and event usage
            updateToolTip(chosenXAxis,chosenYAxis,circlesGroups);
        //label event listener
        if (chosenXAxis === "Points") {
            points
                .classed("active", true)
                .classed("inactive", false);
            ranking
                .classed("active", false)
                .classed("inactive", true);
            //text to modify
            if (chosenYAxis === "avg player rating"){
                d3.select("#analysis")
                .html(`<h5 style='color:white;margin-top:5%'>${chosenXAxis} vs ${chosenYAxis}</h5>
                    <br>
                    <p style='color:white;'> We can observe a positive correlation
                    of <strong id="corr">0.7</strong>.<br> This implies 
                    that the less better the player rating, the more the team has points.
                    <br> The correlation is here defined as a very strong positive relationship.
                    (0.7 or higher)</p>`)
            }else if (chosenYAxis === "Possession%"){
                d3.select("#analysis")
                .html(`<h5 style='color:white;margin-top:5%'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a positive correlation
                    of <strong id="corr">0.7</strong>.<br> This implies 
                    that the hightest the ball possesion, the more the team has points.
                    <br> The correlation is here defined as a very strong positive relationship.
                    (0.7 or higher) </p>`)
            }else if (chosenYAxis === "Pass%"){
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a positive correlation
                    of <strong id="corr">0.6</strong>.<br> This implies 
                    that the more passes a team makes, the more points a team has.
                    <br> The correlation is here defined as a strong positive relationship.
                    (between 0.4 and 0.69) </p>`)
            //text to modify
            }else if (chosenYAxis === "MA"){
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a positive correlation
                    of <strong id="corr">0.6</strong>.<br> This implies 
                    that the more passes a team makes, the more points a team has.
                    <br> The correlation is here defined as a strong positive relationship.
                    (between 0.4 and 0.69) </p>`)
            //text to modify
            }else if (chosenYAxis === "Shots pg"){
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a positive correlation
                    of <strong id="corr">0.6</strong>.<br> This implies 
                    that the more passes a team makes, the more points a team has.
                    <br> The correlation is here defined as a strong positive relationship.
                    (between 0.4 and 0.69) </p>`)
            }else{
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a positive correlation
                    of <strong id="corr">0.6</strong>.<br> This implies 
                    that the more goals a team scores, the better the team is ranked.
                    <br> The correlation is here defined as a strong positive relationship.
                    (between 0.4 and 0.69) </p>`)
            }  
        }else{
            ranking
                .classed("active", true)
                .classed("inactive", false);
            points
                .classed("active", false)
                .classed("inactive", true);
                //text to modify
                if (chosenYAxis === "avg player rating"){
                    d3.select("#analysis")
                    .html(`<br><br><br><br><br>
                        <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                        <p style='color:white;'> We can observe a positive correlation
                        of <strong id="corr">0.4</strong>.<br> This implies 
                        that the less goals a team takes, the more points a team has.
                        <br> The correlation is here defined as a strong positive relationship. (between
                        0.4 and 0.69)</p>`)
                }else if (chosenYAxis === "Possession%"){
                    d3.select("#analysis")
                    .html(`<br><br><br><br><br>
                        <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                        <p style='color:white;'> We can observe a negative correlation
                        of <strong id="corr">-0.7</strong>.<br> This implies 
                        that the hightest the ball possesion, the better the team is ranked.
                        <br> The correlation is here defined as a very strong negative relationship.
                        (-0.7 or higher) </p>`)
                }else if (chosenYAxis === "Pass%"){
                    d3.select("#analysis")
                    .html(`<br><br><br><br><br>
                        <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                        <p style='color:white;'> We can observe a negative correlation
                        of <strong id="corr">-0.6</strong>.<br> This implies 
                        that the more passes a team makes, the better the team is ranked.
                        <br> The correlation is here defined as a strong negative relationship.
                        (between -0.4 and -0.69) </p>`)
                //text to modify
                }else if (chosenYAxis === "MA"){
                    d3.select("#analysis")
                    .html(`<br><br><br><br><br>
                        <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                        <p style='color:white;'> We can observe a positive correlation
                        of <strong id="corr">0.6</strong>.<br> This implies 
                        that the more passes a team makes, the more points a team has.
                        <br> The correlation is here defined as a strong positive relationship.
                        (between 0.4 and 0.69) </p>`)
                //text to modify
                }else if (chosenYAxis === "Shots pg"){
                    d3.select("#analysis")
                    .html(`<br><br><br><br><br>
                        <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                        <p style='color:white;'> We can observe a positive correlation
                        of <strong id="corr">0.6</strong>.<br> This implies 
                        that the more passes a team makes, the more points a team has.
                        <br> The correlation is here defined as a strong positive relationship.
                        (between 0.4 and 0.69) </p>`)
                }else{
                    d3.select("#analysis")
                    .html(`<br><br><br><br><br>
                        <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                        <p style='color:white;'> We can observe a negative correlation
                        of <strong id="corr">-0.6</strong>.<br> This implies 
                        that the more goals a team scores, the better the team is ranked.
                        <br> The correlation is here defined as a strong negative relationship.
                        (between -0.4 and -0.69) </p>`)
                }
        }
        //text to modify
        if (chosenYAxis === "avg player rating") {
            player_rating
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
            movingAverage
                .classed("active", false)
                .classed("inactive", true);
            shots
                .classed("active", false)
                .classed("inactive", true);
            if (chosenXAxis === "Ranking"){
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a positive correlation
                    of <strong id="corr">0.4</strong>.<br> This implies 
                    that the less goals a team takes, the better the team is ranked.
                    <br> The correlation is here defined as a strong positive relationship. (between
                    0.4 and 0.69)</p>`)
            }else{
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a positive correlation
                    of <strong id="corr">0.4</strong>.<br> This implies 
                    that the less goals a team takes, the more points a team has.
                    <br> The correlation is here defined as a strong positive relationship. (between
                    0.4 and 0.69)</p>`)
            }
        }else if (chosenYAxis === "Possession%") {
            player_rating
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
            movingAverage
                .classed("active", false)
                .classed("inactive", true);
            shots
                .classed("active", false)
                .classed("inactive", true);
            if (chosenXAxis === "Ranking"){
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a negative correlation
                    of <strong id="corr">-0.7</strong>.<br> This implies 
                    that the hightest the ball possesion, the better the team is ranked.
                    <br> The correlation is here defined as a very strong negative relationship.
                    (-0.7 or higher) </p>`)
            }else{
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a positive correlation
                    of <strong id="corr">0.7</strong>.<br> This implies 
                    that the hightest the ball possesion, the more point a team has.
                    <br> The correlation is here defined as a very strong positive relationship.
                    (0.7 or higher) </p>`)
            }
            
        }else if (chosenYAxis === "Pass%") {
            player_rating
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
            movingAverage
                .classed("active", false)
                .classed("inactive", true);
            shots
                .classed("active", false)
                .classed("inactive", true);
            if (chosenXAxis === "Ranking"){
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a negative correlation
                    of <strong id="corr">-0.6</strong>.<br> This implies 
                    that the more passes a team makes, the better the team is ranked.
                    <br> The correlation is here defined as a strong negative relationship.
                    (between -0.4 and -0.69) </p>`)
            }else{
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a positive correlation
                    of <strong id="corr">0.6</strong>.<br> This implies 
                    that the more passes a team makes, the more points a team has.
                    <br> The correlation is here defined as a strong positive relationship.
                    (between 0.4 and 0.69) </p>`)
            }
            //text to modify
        }else if (chosenYAxis === "MA") {
            player_rating
                .classed("active", false)
                .classed("inactive", true);
            goals_for
                .classed("active", false)
                .classed("inactive", true);
            possession
                .classed("active", false)
                .classed("inactive", true);
            passes
                .classed("active", false)
                .classed("inactive", true);
            movingAverage
                .classed("active", true)
                .classed("inactive", false);
            shots
                .classed("active", false)
                .classed("inactive", true);
            if (chosenXAxis === "Ranking"){
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a negative correlation
                    of <strong id="corr">-0.6</strong>.<br> This implies 
                    that the more passes a team makes, the better the team is ranked.
                    <br> The correlation is here defined as a strong negative relationship.
                    (between -0.4 and -0.69) </p>`)
            }else{
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a positive correlation
                    of <strong id="corr">0.6</strong>.<br> This implies 
                    that the more passes a team makes, the more points a team has.
                    <br> The correlation is here defined as a strong positive relationship.
                    (between 0.4 and 0.69) </p>`)
            }
            //text to modify
        }else if (chosenYAxis === "Shots pg") {
            player_rating
                .classed("active", false)
                .classed("inactive", true);
            goals_for
                .classed("active", false)
                .classed("inactive", true);
            possession
                .classed("active", false)
                .classed("inactive", true);
            passes
                .classed("active", false)
                .classed("inactive", true);
            movingAverage
                .classed("active", false)
                .classed("inactive", true);
            shots
                .classed("active", true)
                .classed("inactive", false);
            if (chosenXAxis === "Ranking"){
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a negative correlation
                    of <strong id="corr">-0.6</strong>.<br> This implies 
                    that the more passes a team makes, the better the team is ranked.
                    <br> The correlation is here defined as a strong negative relationship.
                    (between -0.4 and -0.69) </p>`)
            }else{
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a positive correlation
                    of <strong id="corr">0.6</strong>.<br> This implies 
                    that the more passes a team makes, the more points a team has.
                    <br> The correlation is here defined as a strong positive relationship.
                    (between 0.4 and 0.69) </p>`)
            }
        }else {
            player_rating
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
            movingAverage
                .classed("active", false)
                .classed("inactive", true);
            shots
                .classed("active", false)
                .classed("inactive", true);
            if (chosenXAxis === "Ranking"){
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a negative correlation
                    of <strong id="corr">-0.6</strong>.<br> This implies 
                    that the more goals a team scores, the better the team is ranked.
                    <br> The correlation is here defined as a strong negative relationship.
                    (between -0.4 and -0.69) </p>`)
            }else{
                d3.select("#analysis")
                .html(`<br><br><br><br><br>
                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                    <p style='color:white;'> We can observe a positive correlation
                    of <strong id="corr">0.6</strong>.<br> This implies 
                    that the more goals a team scores, the better the team is ranked.
                    <br> The correlation is here defined as a strong positive relationship.
                    (between 0.4 and 0.69) </p>`)
            }
        }
            xlabelsGroup.selectAll('text')
            .on('click', function(){
                var valueX = d3.select(this).attr("value");
                
                if (valueX !== chosenXAxis){
                    chosenXAxis = valueX;
                    xLinearScale = xScale(data, chosenXAxis);
                    xAxis = xAxes(xLinearScale, xAxis);
                    circles = renderCircles(circles,xLinearScale,chosenXAxis,yLinearScale,chosenYAxis);
                    circlesGroups = updateToolTip(chosenXAxis,chosenYAxis,circlesGroups);
                    if (chosenXAxis === "Points") {
                        points
                            .classed("active", true)
                            .classed("inactive", false);
                        ranking
                            .classed("active", false)
                            .classed("inactive", true);
                        //text to modify
                        if (chosenYAxis === "avg player rating"){
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a positive correlation
                                of <strong id="corr">0.4</strong>.<br> This implies 
                                that the less goals a team takes, the better the team is ranked.
                                <br> The correlation is here defined as a strong positive relationship. (between
                                0.4 and 0.69)</p>`)
                        }else if (chosenYAxis === "Possession%"){
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a positive correlation
                                of <strong id="corr">0.7</strong>.<br> This implies 
                                that the hightest the ball possesion, the more point a team has.
                                <br> The correlation is here defined as a very strong positive relationship.
                                (0.7 or higher) </p>`)
                        }else if (chosenYAxis === "Pass%"){
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a positive correlation
                                of <strong id="corr">0.6</strong>.<br> This implies 
                                that the more passes a team makes, the more points a team has.
                                <br> The correlation is here defined as a strong positive relationship.
                                (between 0.4 and 0.69) </p>`)
                        //text to modify
                        }else if (chosenYAxis === "MA"){
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a positive correlation
                                of <strong id="corr">0.6</strong>.<br> This implies 
                                that the more passes a team makes, the more points a team has.
                                <br> The correlation is here defined as a strong positive relationship.
                                (between 0.4 and 0.69) </p>`)
                        //text to modify
                        }else if (chosenYAxis === "Shots pg"){
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a positive correlation
                                of <strong id="corr">0.6</strong>.<br> This implies 
                                that the more passes a team makes, the more points a team has.
                                <br> The correlation is here defined as a strong positive relationship.
                                (between 0.4 and 0.69) </p>`)
                        }else{
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a positive correlation
                                of <strong id="corr">0.6</strong>.<br> This implies 
                                that the more goals a team scores, the better the team is ranked.
                                <br> The correlation is here defined as a strong positive relationship.
                                (between 0.4 and 0.69) </p>`)
                        }  
                    }else{
                        ranking
                            .classed("active", true)
                            .classed("inactive", false);
                        points
                            .classed("active", false)
                            .classed("inactive", true);
                            //text to modify
                            if (chosenYAxis === "avg player rating"){
                                d3.select("#analysis")
                                .html(`<br><br><br><br><br>
                                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                    <p style='color:white;'> We can observe a positive correlation
                                    of <strong id="corr">0.4</strong>.<br> This implies 
                                    that the less goals a team takes, the more points a team has.
                                    <br> The correlation is here defined as a strong positive relationship. (between
                                    0.4 and 0.69)</p>`)
                            }else if (chosenYAxis === "Possession%"){
                                d3.select("#analysis")
                                .html(`<br><br><br><br><br>
                                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                    <p style='color:white;'> We can observe a negative correlation
                                    of <strong id="corr">-0.7</strong>.<br> This implies 
                                    that the hightest the ball possesion, the better the team is ranked.
                                    <br> The correlation is here defined as a very strong negative relationship.
                                    (-0.7 or higher) </p>`)
                            }else if (chosenYAxis === "Pass%"){
                                d3.select("#analysis")
                                .html(`<br><br><br><br><br>
                                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                    <p style='color:white;'> We can observe a negative correlation
                                    of <strong id="corr">-0.6</strong>.<br> This implies 
                                    that the more passes a team makes, the better the team is ranked.
                                    <br> The correlation is here defined as a strong negative relationship.
                                    (between -0.4 and -0.69) </p>`)
                            //text to modify
                            }else if (chosenYAxis === "MA"){
                                d3.select("#analysis")
                                .html(`<br><br><br><br><br>
                                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                    <p style='color:white;'> We can observe a positive correlation
                                    of <strong id="corr">0.6</strong>.<br> This implies 
                                    that the more passes a team makes, the more points a team has.
                                    <br> The correlation is here defined as a strong positive relationship.
                                    (between 0.4 and 0.69) </p>`)
                            //text to modify
                            }else if (chosenYAxis === "Shots pg"){
                                d3.select("#analysis")
                                .html(`<br><br><br><br><br>
                                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                    <p style='color:white;'> We can observe a positive correlation
                                    of <strong id="corr">0.6</strong>.<br> This implies 
                                    that the more passes a team makes, the more points a team has.
                                    <br> The correlation is here defined as a strong positive relationship.
                                    (between 0.4 and 0.69) </p>`)
                            }else{
                                d3.select("#analysis")
                                .html(`<br><br><br><br><br>
                                    <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                    <p style='color:white;'> We can observe a negative correlation
                                    of <strong id="corr">-0.6</strong>.<br> This implies 
                                    that the more goals a team scores, the better the team is ranked.
                                    <br> The correlation is here defined as a strong negative relationship.
                                    (between -0.4 and -0.69) </p>`)
                            }
                    }
                }
            });
            ylabelsGroup.selectAll('text')
            .on('click', function(){
                var valueY = d3.select(this).attr("value"); 
                lastYChoice = valueY;
                if (valueY !== chosenYAxis){
                    chosenYAxis = valueY;
                    yLinearScale = yScale(data, chosenYAxis);
                    yAxis = yAxes(yLinearScale, yAxis);
                    circles = renderCircles(circles,xLinearScale,chosenXAxis,yLinearScale,chosenYAxis);
                    circlesGroups = updateToolTip(chosenXAxis,chosenYAxis,circlesGroups);
                    if (chosenYAxis === "avg player rating") {
                        player_rating
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
                        movingAverage
                            .classed("active", false)
                            .classed("inactive", true);
                        shots
                            .classed("active", false)
                            .classed("inactive", true);
                        if (chosenXAxis === "Ranking"){
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a positive correlation
                                of <strong id="corr">0.4</strong>.<br> This implies 
                                that the less goals a team takes, the better the team is ranked.
                                <br> The correlation is here defined as a strong positive relationship. (between
                                0.4 and 0.69)</p>`)
                        }else{
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a positive correlation
                                of <strong id="corr">0.4</strong>.<br> This implies 
                                that the less goals a team takes, the more points a team has.
                                <br> The correlation is here defined as a strong positive relationship. (between
                                0.4 and 0.69)</p>`)
                        }
                    }else if (chosenYAxis === "Possession%") {
                        player_rating
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
                        movingAverage
                            .classed("active", false)
                            .classed("inactive", true);
                        shots
                            .classed("active", false)
                            .classed("inactive", true);
                        if (chosenXAxis === "Ranking"){
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a negative correlation
                                of <strong id="corr">-0.7</strong>.<br> This implies 
                                that the hightest the ball possesion, the better the team is ranked.
                                <br> The correlation is here defined as a very strong negative relationship.
                                (-0.7 or higher) </p>`)
                        }else{
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a positive correlation
                                of <strong id="corr">0.7</strong>.<br> This implies 
                                that the hightest the ball possesion, the more point a team has.
                                <br> The correlation is here defined as a very strong positive relationship.
                                (0.7 or higher) </p>`)
                        }
                        
                    }else if (chosenYAxis === "Pass%") {
                        player_rating
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
                        movingAverage
                            .classed("active", false)
                            .classed("inactive", true);
                        shots
                            .classed("active", false)
                            .classed("inactive", true);
                        if (chosenXAxis === "Ranking"){
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a negative correlation
                                of <strong id="corr">-0.6</strong>.<br> This implies 
                                that the more passes a team makes, the better the team is ranked.
                                <br> The correlation is here defined as a strong negative relationship.
                                (between -0.4 and -0.69) </p>`)
                        }else{
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a positive correlation
                                of <strong id="corr">0.6</strong>.<br> This implies 
                                that the more passes a team makes, the more points a team has.
                                <br> The correlation is here defined as a strong positive relationship.
                                (between 0.4 and 0.69) </p>`)
                        }
                        //text to modify
                    }else if (chosenYAxis === "MA") {
                        player_rating
                            .classed("active", false)
                            .classed("inactive", true);
                        goals_for
                            .classed("active", false)
                            .classed("inactive", true);
                        possession
                            .classed("active", false)
                            .classed("inactive", true);
                        passes
                            .classed("active", false)
                            .classed("inactive", true);
                        movingAverage
                            .classed("active", true)
                            .classed("inactive", false);
                        shots
                            .classed("active", false)
                            .classed("inactive", true);
                        if (chosenXAxis === "Ranking"){
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a negative correlation
                                of <strong id="corr">-0.6</strong>.<br> This implies 
                                that the more passes a team makes, the better the team is ranked.
                                <br> The correlation is here defined as a strong negative relationship.
                                (between -0.4 and -0.69) </p>`)
                        }else{
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a positive correlation
                                of <strong id="corr">0.6</strong>.<br> This implies 
                                that the more passes a team makes, the more points a team has.
                                <br> The correlation is here defined as a strong positive relationship.
                                (between 0.4 and 0.69) </p>`)
                        }
                        //text to modify
                    }else if (chosenYAxis === "Shots pg") {
                        player_rating
                            .classed("active", false)
                            .classed("inactive", true);
                        goals_for
                            .classed("active", false)
                            .classed("inactive", true);
                        possession
                            .classed("active", false)
                            .classed("inactive", true);
                        passes
                            .classed("active", false)
                            .classed("inactive", true);
                        movingAverage
                            .classed("active", false)
                            .classed("inactive", true);
                        shots
                            .classed("active", true)
                            .classed("inactive", false);
                        if (chosenXAxis === "Ranking"){
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a negative correlation
                                of <strong id="corr">-0.6</strong>.<br> This implies 
                                that the more passes a team makes, the better the team is ranked.
                                <br> The correlation is here defined as a strong negative relationship.
                                (between -0.4 and -0.69) </p>`)
                        }else{
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a positive correlation
                                of <strong id="corr">0.6</strong>.<br> This implies 
                                that the more passes a team makes, the more points a team has.
                                <br> The correlation is here defined as a strong positive relationship.
                                (between 0.4 and 0.69) </p>`)
                        }
                    }else {
                        player_rating
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
                        movingAverage
                            .classed("active", false)
                            .classed("inactive", true);
                        shots
                            .classed("active", false)
                            .classed("inactive", true);
                        if (chosenXAxis === "Ranking"){
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a negative correlation
                                of <strong id="corr">-0.6</strong>.<br> This implies 
                                that the more goals a team scores, the better the team is ranked.
                                <br> The correlation is here defined as a strong negative relationship.
                                (between -0.4 and -0.69) </p>`)
                        }else{
                            d3.select("#analysis")
                            .html(`<br><br><br><br><br>
                                <h5 style='color:white;'>${chosenXAxis} vs ${chosenYAxis}</h5><br>
                                <p style='color:white;'> We can observe a positive correlation
                                of <strong id="corr">0.6</strong>.<br> This implies 
                                that the more goals a team scores, the better the team is ranked.
                                <br> The correlation is here defined as a strong positive relationship.
                                (between 0.4 and 0.69) </p>`)
                        }
                    }
                }
            });
            legend.selectAll('text')
            .on('click',function(){
                var year = d3.select(this).text();
                if (year === "All Years"){
                    legend.selectAll(`text`)
                    .style("opacity","0.7")
                    
                    legend.selectAll(`circle`)
                    .style("opacity","0.7")

                    circles.transition()
                    .duration(500)
                    .attr('opacity',d => (d[chosenYAxis] ===0) ? 0 :0.7)
                    .attr("stroke-width", d => (d[chosenYAxis] ===0) ? "0" :"1")
                    .attr("stroke", "white");

                }else{
                    d3.select(this).style("opacity", "1")
                    legend.selectAll(`text:not(#t${year})`)
                    .style("opacity", "0.3");
                
                    var circlesYear = d3.selectAll(`.y${year}`);
                    circlesYear.transition()
                    .duration(500)
                    .attr("opacity","1")
                    .attr("stroke-width", "1")
                    .attr("stroke", "white");
    
                    var circlesNotYear = d3.selectAll(`circle:not(.y${year})`);
                    circlesNotYear.transition()
                    .duration(500)
                    .attr("opacity","0.2");
                }
            })
        });
    }
    init(country);      
        //correlation data
    d3.csv(`../data/team_player/cleaned_final/correlation.csv`).then((corrData,error)=>{
        var labels = corrData.columns.map(d=>(d.split(" ").length>2)?(
                d.split(" ")[1])+" "+(d.split(" ")[2]):(d.split(" ")[0]))
        var correlationMatrix = []
        for(var i=0;i<labels.length;i++){
            correlationMatrix.push(corrData.map(d => +(parseFloat(d[corrData.columns[i]]).toFixed(1))))
        };

        var margin = {top: 30, right: 10, bottom: 90, left: 100},
                width = window.innerWidth/2.5,
                height = window.innerWidth/3,
                data = correlationMatrix,
                labelsData = labels;
            
        var widthLegend = 60;
        
        if(!data){
            throw new Error('Please pass data');
        };
        if(!Array.isArray(data) || !data.length || !Array.isArray(data[0])){
            throw new Error('It should be a 2-D array');
        };
        
        var maxValue = d3.max(data, function(layer) { return d3.max(layer, function(d) { return d; }); });
        var minValue = d3.min(data, function(layer) { return d3.min(layer, function(d) { return d; }); });
    
        var numrows = data.length;
        var numcols = data[0].length;
    
        var corr = d3.select("#corrmatrix")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand()
            .domain(d3.range(numcols))
            .range([0, width]);
    
        var y = d3.scaleBand()
            .domain(d3.range(numrows))
            .range([0, height]);
    
        var colorMap = d3.scaleSequential()
            .domain([-1,maxValue])
            .interpolator(d3.interpolateRdBu);
    
        var row = corr.selectAll(".row")
            .data(data)
                .enter().append("g")
            .attr("class", "row")
            .attr("id",function(d,i){return `row${i}`})
            .attr("transform", function(d, i) { return "translate(0," + y(i) + ")"; });
    
        var cell = row.selectAll(".cell")
            .data(function(d) { return d; })
                .enter().append("g")
            .attr("class", "cell")
            .attr("id",function(d,i){return `cell${i}`})
            .attr("transform", function(d, i) { return "translate(" + x(i) + ", 0)"; });
    
        cell.append('rect')
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .attr("value",function(d, i) { return d; })
            
        // cell.append("text")
        //     .attr("dy", ".20em")
        //     .attr("x", x.bandwidth() / 2)
        //     .attr("y", y.bandwidth() / 2)
        //     .attr("text-anchor", "middle")
        //     .style("opacity", "0")
        //     .text(function(d, i) { return d; });
        
        row.selectAll(".cell")
            .data(function(d, i) { return data[i]; })
            .style("fill", d=>colorMap(d));

        //delete the top cells to make a triangle
        var deleteCells = -1;
        for(var i=0;i<correlationMatrix.length;i++){
            for(var j=correlationMatrix.length;j>deleteCells;j--){
                d3.select("#corrmatrix")
                .select(`#row${i}`)
                .select(`#cell${j}`)
                .remove();
            }
            deleteCells +=1;
        };
        //labels
        var labels = corr.append('g')
            .attr('class', "labels");
    
        var columnLabels = labels.selectAll(".column-label")
            .data(labelsData)
            .enter().append("g")
            .style('fill','white')
            .style('font-size', "80%")
            .attr("class", "column-label")
            .attr("transform", function(d, i) { return "translate(" + x(i) + "," + height + ")"; });
    
        columnLabels.append("line")
            .style("stroke", "white")
            .style("stroke-width", "1px")
            .attr("x1", x.bandwidth() / 2)
            .attr("x2", x.bandwidth() / 2)
            .attr("y1", 0)
            .attr("y2", 5);
    
        columnLabels.append("text")
            .attr("x", 0)
            .attr("y", y.bandwidth() / 2)
            .attr("dy", ".65em")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-60)")
            .text(function(d, i) { return d; });
    
        var rowLabels = labels.selectAll(".row-label")
            .data(labelsData)
            .enter().append("g")
            .style('fill','white')
            .style('font-size', "80%")
            .attr("class", "row-label")
            .attr("transform", function(d, i) { return "translate(" + 0 + "," + y(i) + ")"; });
    
        rowLabels.append("line")
            .style("stroke", "white")
            .style("stroke-width", "1px")
            .attr("x1", 0)
            .attr("x2", -5)
            .attr("y1", y.bandwidth() / 2)
            .attr("y2", y.bandwidth() / 2);
    
        rowLabels.append("text")
            .attr("x", -8)
            .attr("y", y.bandwidth() / 2)
            .attr("dy", ".25em")
            .attr("text-anchor", "end")
            .text(function(d, i) { return d; });

        //legend
        var legend = d3.legendColor()
            .cells(30)
            .labels(['','','','','','','','','','','','','','','','','','','','',,'','','','','','','','','','','',''])
            .shapeHeight(height/30)
            .shapePadding(0)
            .scale(colorMap)
            .on("cellover", function(d){
                var value = d3.select("#corrmatrix").selectAll("rect");
                value.each(function(cellvalue,i){
                    var rectMatrix = d3.select("#corrmatrix").selectAll(`[value="${cellvalue}"]`);
                    if(cellvalue>(d-0.035) && cellvalue<d+0.035){
                        d3.select(this).style("opacity", "0.2");
                        rectMatrix.style("opacity","1");
                    }else{
                        rectMatrix.style("opacity","0.2");
                    }
                })
            })
            .on("cellout", function(d){
                var value = d3.select("#corrmatrix").selectAll("rect");
                value.each(function(cellvalue,i){
                    d3.select("#corrmatrix")
                        .selectAll(`[value="${cellvalue}"]`)
                        .style("opacity","1");
                    d3.select(this).style("opacity", "1");
                    }
                )
            });
        
        var l = d3.select("#corrmatrix")
            .append("svg")
            .attr("class","legendMatrix")
            .attr("transform",`translate(0,${margin.top+5})`)
            .attr("width", widthLegend)
            .attr("height", height + margin.top + margin.bottom)
            .call(legend);

        var yy = d3.scaleLinear()
            .range([height-10, 0])
            .domain([maxValue,-1]);
        
        var yAxis = d3.axisRight(yy);
    
        l.append("g")
             .attr("class", "y axis")
             .style("color","white")
             .attr("transform", "translate(21,3)")
             .call(yAxis)
        }).catch(function(error) {
    console.log(error);
    });
}

makeResponsive();

d3.select(window).on("resize", makeResponsive);
