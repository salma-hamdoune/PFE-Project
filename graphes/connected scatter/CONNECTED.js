// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
    
// A color scale: one color for each group
 Accounts=[
//     //  "1196428'",
// // "1196711'",
// //  "409000362497'",
// //  "409000438611'",
// //  "409000438620'"
//  "409000493201'",
// // "409000493210'",
//  "409000611074'"
 'A',
 'B'
]
var color = d3.scaleOrdinal()
.domain(Accounts)
.range(d3.schemeSet2);

//Read the data
d3.csv("monthly_aggregations.csv",

  // When reading the csv, I must format variables:
  function(d){
    return { DATE : d3.timeParse("%Y-%m-%d")(d.DATE), mean_mo_dep : d.mean_mo_dep ,Account_No: d.Account_No}
  },

  // Now I can use this dataset:
  function(data) {
      console.log(data)

      data=data.filter(function(row){
            //  return row["Account_No"]==="409000438620'"
            return Accounts.includes(row["Account_No"]);
           })

    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function(d) { return d.DATE; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    console.log(data)
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([d3.min(data, function(d) {
        return +d.mean_mo_dep; }), d3.max(data, function(d) {
        return +d.mean_mo_dep; })])
      .range([ height, 0 ]);    
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .data(data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .curve(d3.curveBasis) // Just add that to have a curve instead of segments
        .x(function(d) { return x(d.DATE) })
        .y(function(d) { return y(d.mean_mo_dep) })
        )

      

    // create a tooltip
    var Tooltip = d3.select("#my_dataviz")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function(d) {
        Tooltip
          .style("opacity", 1)
      }
      var mousemove = function(d) {
        Tooltip
          .html("Account: " + d.Account_No)
          .style("left", (d3.mouse(this)[0]+70) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
      }
      var mouseleave = function(d) {
        Tooltip
          .style("opacity", 0)
      }

    // Add the points
    svg
      .append("g")
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("class", "myCircle")
        .attr("cx", function(d) { return x(d.DATE) } )
        .attr("cy", function(d) { return y(d.mean_mo_dep) } )
        .attr("r", 8)
        .attr("stroke", "#F1F0F0")
        .attr("stroke-width", 3)
        .attr("fill", "white")
        .style("fill", function(d) { return color(d.Account_No); })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
})