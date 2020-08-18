// https://www.d3-graph-gallery.com/graph/parallel_custom.html


// set the dimensions and margins of the graph
var margin = {top: 30, right: 50, bottom: 10, left: 50},
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("transactions2018withscores.csv", function(data) {
   data.index=+data.index;
   data.month=+data.month;
   data.day=+data.day;
   data.bal_score=+data.bal_score;
   data.Amount_score=+data.Amount_score;
   data.overall_score=+data.overall_score;  

   data=data.filter(function(row){
    return row["Account_No"]==="409000405747'";
    })

   var axes_data = data.map(function(d) {
    return {
    //   Account_No: d.Account_No,
      index: +d.index,
      day: +d.day,
      month: +d.month,
      bal_score: +d.bal_score,
      Amount_score: +d.Amount_score,
      overall_score: +d.overall_score
    }
  });
  console.log(axes_data.index)
  console.log(d3.keys(axes_data[0])[0].dtype)

  console.log(axes_data)


  // Color scale: give me a specie name, I return a color
  var color = d3.scaleOrdinal()
    .domain([0, 1, 2 ])
    .range([ "#440154ff", "#21908dff", "#fde725ff"])
    // .domain(["setosa", "versicolor", "virginica" ])
    // .range([ "#440154ff", "#21908dff", "#fde725ff"])

  // Here I set the list of dimension manually to control the order of axis:
//   dimensions = ["Petal_Length", "Petal_Width", "Sepal_Length", "Sepal_Width"]
   dimensions = d3.keys(axes_data[0])
//    .filter(function(d) {
//     return d != "Account_No" 
    // && d != "BALANCE_AMT" &&
//     d != "DATE" && d != "TRANSACTION_DETAILS" && d != "type" &&
//     d != "year" &&  d != "receiver_Account" &&
//     d != "WITHDRAWAL_AMT" && d != "DEPOSIT_AMT"  &&
//     d != "AMOUNT" && d != "cluster"
//     && d != "cluster_max"
    // })
console.log(dimensions)
  // For each dimension, I build a linear scale. I store all in a y object
  var y = {}
  for (i in dimensions) {
    name = dimensions[i]
    y[name] = d3.scaleLinear()
    //   .domain( [0,8] ) // --> Same axis range for each group
  // --> different axis range for each group --> 
      .domain( [d3.extent(data, function(d) { return +d[name]; })] )
      .range([height, 0])
   }
// //   name= dimensions[1]
// //   y[name]=d3.scaleLinear()
// //     .domain( [d3.extent(data, function(d) { return +d[name]; })] )
// //     .range([height, 0])
// //  console.log([d3.extent(data, function(d) { return +d[name]; })])

//   // Build the X scale -> it find the best position for each Y axis
  x = d3.scalePoint()
    .range([0, width])
    .domain(dimensions);

//   // Highlight the specie that is hovered
  var highlight = function(d){

    selected_cluster = d.cluster

    // first every group turns grey
    d3.selectAll(".line")
      .transition().duration(200)
      .style("stroke", "lightgrey")
      .style("opacity", "0.2")
    // Second the hovered specie takes its color
    d3.selectAll("." + selected_cluster)
      .transition().duration(200)
      .style("stroke", color(selected_cluster))
      .style("opacity", "1")
  }

//   // Unhighlight
  var doNotHighlight = function(d){
    d3.selectAll(".line")
      .transition().duration(200).delay(1000)
      .style("stroke", function(d){ return( color(d.cluster))} )
      .style("opacity", "1")
  }

//   // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
  function path(d) {
      return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));

    }

//   console.log(dimensions)
// console.log(data)
console.log(d3.keys(axes_data[0])[0].dtype)
//   // Draw the lines
  svg
    .selectAll("myPath")
    .data(axes_data)
    .enter()
    .append("path")
    //   .attr("class", function (d) { return "line " + d.cluster } ) // 2 class for each line: 'line' and the group name
      .attr("d",  path)
      .style("fill", "none" )
    //   .style("stroke", function(d){ return( color(d.cluster))} )
      .style("opacity", 0.5)
    //   .on("mouseover", highlight)
    //   .on("mouseleave", doNotHighlight )

//   // Draw the axis:
//   svg.selectAll("myAxis")
//     // For each dimension of the dataset I add a 'g' element:
//     .data(dimensions).enter()
//     .append("g")
//     .attr("class", "axis")
//     // I translate this element to its right position on the x axis
//     .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
//     // And I build the axis with the call function
//     .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
//     // Add axis title
//     .append("text")
//       .style("text-anchor", "middle")
//       .attr("y", -9)
//       .text(function(d) { return d; })
//       .style("fill", "black")

})

