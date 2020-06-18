// set the dimensions and margins of the graph
var margina = {top: 10, right: 30, bottom: 30, left: 100},
    widtha = 1300 - margina.left - margina.right,
    heighta = 400 - margina.top - margina.bottom;

// append the svg object to the body of the page
var svgarea = d3.select("#area")
  .append("svg")
    .attr("width", widtha + margina.left + margina.right)
    .attr("height", heighta + margina.top + margina.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margina.left + "," + margina.top + ")");

//Read the data

// choose a client
d3.csv("df18_ts.csv").then(function(data){
  data=data.filter(function(row){
    return row["Account_No"]==="1196428'";
  //console.log(data)
  })
//client.then(function(data){
  console.log(data)

  // function convert(d) {
  //   return {
  //     DATE: new Date(d.DATE),
  //     value: +d.value}}


  // var groups = d3.map(data, function(d){return(d.Account_No)}).keys()
  // console.log(groups[9])
  //console.log(data[0])
  
  // client=data.filter(function(row){
  //   return row["Account_No"]==="409000611074'"
  // })
  //console.log(client)

  // Add X axis --> it is a date format
  var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) {return d3.timeParse("%Y-%m-%d")(d.DATE); }))
    .range([ 0, widtha ]);
   console.log(d3.extent(data, function(d) { 
     return d3.timeParse("%Y-%m-%d")(d.DATE); }))
  xAxis = svgarea.append("g")
    .attr("transform", "translate(0," + heighta + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
      return +d.withd_by_date; })])
    .range([ heighta, 0 ]);
  yAxis = svgarea.append("g")
    .call(d3.axisLeft(y));


  console.log(d3.max(data, function(d) {
    return +d.withd_by_date; }))
  // Add a clipPath: everything out of this area won't be drawn.
  var clip = svgarea.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", widtha )
      .attr("height", heighta )
      .attr("x", 0)
      .attr("y", 0);

  // Add brushing
  var brush = d3.brush()                   // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [widtha,heighta] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

  // Create the area variable: where both the area and the brush take place
  var area = svgarea.append('g')
    .attr("clip-path", "url(#clip)")

  // Create an area generator
  var areaGenerator = d3.area()
    .x(function(d) { 
      return x(d3.timeParse("%Y-%m-%d")(d.DATE)) })
    .y0(y(0))
    .y1(function(d) {
      return y(+d.withd_by_date) })

  // Add the area
  area.append("path")
    .datum(data)
    .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
    .attr("fill", "#69b3a2")
    .attr("fill-opacity", .3)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("d", areaGenerator )

  // Add the brushing
  area
    .append("g")
      .attr("class", "brush")
      .call(brush);

  // A function that set idleTimeOut to null
  var idleTimeout
  function idled() { idleTimeout = null; }

  // A function that update the chart for given boundaries
  function updateChart() {

    // What are the selected boundaries?
    extent = d3.event.selection

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if(!extent){
      if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
      x.domain([ 4,8])
      y.domain([ 4,8]) //added
    }else{
     // x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
      x.domain([ x.invert(extent[0][0]), x.invert(extent[1][0]) ])

      y.domain([ y.invert(extent[1][1]), y.invert(extent[0][1]) ])//added

      area.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and area position
    xAxis.transition().duration(1000).call(d3.axisBottom(x))
    yAxis.transition().duration(1000).call(d3.axisLeft(y))

    area
        .select('.myArea')
        .transition()
        .duration(1000)
        .attr("d", areaGenerator)
}

// If user double click, reinitialize the chart
svgarea.on("dblclick",function(){
  x.domain(d3.extent(data, function(d) { 
    return d3.timeParse("%Y-%m-%d")(d.DATE); }))
  xAxis.transition().call(d3.axisBottom(x))
  y.domain([0, d3.max(data, function(d) {return +d.withd_by_date})])

  yAxis.transition().call(d3.axisLeft(y))
  area
    .select('.myArea')
    .transition()
    .attr("d", areaGenerator)
});



})

