// set the dimensions and margins of the graph
var margind = {top: 60, right: 230, bottom: 50, left: 50},
    widthd =  660 - margind.left - margind.right,
    heightd =  400 - margind.top - margind.bottom;

// append the svg object to the body of the page
var svgd = d3.select("#densities")
  .append("svg")
    .attr("width", widthd + margind.left + margind.right)
    .attr("height", heightd + margind.top + margind.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margind.left + "," + margind.top + ")");

// Parse the Data
d3.csv("densities.csv").then(function(data) {


  //////////
  // GENERAL //
  //////////

  // List of groups = header of the csv files
  var keys = data.columns.slice(1)

  // color palette
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeSet2);

  //stack the data?
  var stackedData = d3.stack()
    .keys(keys)
    (data)



  //////////
  // AXIS //
  //////////

  // Add X axis
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) { return d.year; }))
    .range([ 0, widthd ]);
  var xAxis = svgd.append("g")
    .attr("transform", "translate(0," + heightd + ")")
    .call(d3.axisBottom(x).ticks(5))

  // Add X axis label:
  svgd.append("text")
      .attr("text-anchor", "end")
      .attr("x", widthd)
      .attr("y", heightd+40 )
      .text("Time (year)");

  // Add Y axis label:
  svgd.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -20 )
      //.text("")
      .attr("text-anchor", "start")

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 200000])
    .range([ heightd, 0 ]);
  svgd.append("g")
    .call(d3.axisLeft(y).ticks(5))



  //////////
  // BRUSHING AND CHART //
  //////////

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = svgd.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", widthd )
      .attr("height", heightd )
      .attr("x", 0)
      .attr("y", 0);

  // Add brushing
  var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [widthd,heightd] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function

  // Create the scatter variable: where both the circles and the brush take place
  var areaChart = svgd.append('g')
    .attr("clip-path", "url(#clip)")

  // Area generator
  var area = d3.area()
    .x(function(d) { return x(d.data.year); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })

  // Show the areas
  areaChart
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .attr("class", function(d) { return "myArea " + d.key })
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)

  // Add the brushing
  areaChart
    .append("g")
      .attr("class", "brush")
      .call(brush);

  var idleTimeout
  function idled() { idleTimeout = null; }

  // A function that update the chart for given boundaries
  function updateChart() {

    extent = d3.event.selection

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(!extent){
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
      x.domain(d3.extent(data, function(d) { return d.year; }))
    }else{
      x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
      areaChart.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and area position
    xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5))
    areaChart
      .selectAll("path")
      .transition().duration(1000)
      .attr("d", area)
    }



    //////////
    // HIGHLIGHT GROUP //
    //////////

    // What to do when one group is hovered
    var highlight = function(d){
      console.log(d)
      // reduce opacity of all groups
      d3.selectAll(".myArea").style("opacity", .1)
      // expect the one that is hovered
      d3.select("."+d).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function(d){
      d3.selectAll(".myArea").style("opacity", 1)
    }



    //////////
    // LEGEND //
    //////////

    // Add one dot in the legend for each name.
    var size = 20
    svgd.selectAll("myrect")
      .data(keys)
      .enter()
      .append("rect")
        .attr("x", 400)
        .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add one dot in the legend for each name.
    svgd.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
        .attr("x", 400 + size*1.2)
        .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

})
