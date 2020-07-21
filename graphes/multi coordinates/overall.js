// set the dimensions and margins of the graph
var margin = {top: 20, right: 60, bottom: 60, left: 60},
    width = 600 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz2")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")")

//Read the data
d3.csv("transactions2018withscores.csv", function(data) {

  allGroup=d3.map(data, function(d){return d.Account_No;}).keys();
  var  dataFilter1 =data.filter(function(row){
    return row["Account_No"]===allGroup[0];
    })
  // Add X axis
  var x = d3.scaleLinear()
    .domain([0, 0])
    .range([ 0, width ]);
  svg.append("g")
    .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .attr("opacity", "0")

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(dataFilter1, function(d) {
        return +d.overall_score; })])
    .range([ height, 0]);
  yAxis= svg.append("g")
    .call(d3.axisLeft(y));

  // Add dots
var dots = svg.append('g')
    .selectAll("dot")
    .data(dataFilter1, function(d) { return d.index; })
    .enter()
    .append("circle")
      .attr("cx", function (d) { return x(d.AMOUNT); } )
      .attr("cy", function (d) { return y(d.overall_score); } )
      .attr("r", 3)
      .style("fill", "#69b3a2")

  // new X axis
  x.domain([0, d3.max(dataFilter1, function(d) {
             return +d.AMOUNT; })])
  svg.select(".myXaxis")
    .transition()
    .duration(1000)
    .attr("opacity", "1")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("y", 0)
    .attr("x", 9)
    .attr("dy", ".35em")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start");
    

  // svg.selectAll("circle")
  //   .transition()
  //   .delay(function(d,i){return(i*3)})
  //   .duration(2000)
  //   .attr("cx", function (d) { return x(d.AMOUNT); } )
  //   .attr("cy", function (d) { return y(d.overall_score); } )




    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
      .data(allGroup)
      .enter()
      .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button



    // A function that update the chart
    function update(selectedGroup) {
      // Create new data with the selection?
      dots.exit().remove()

      var dataFilter = data.filter(function(d){return d.Account_No===selectedGroup})
      // var dots = svg.append('g')
      dots.selectAll("dot").data(dataFilter);


      // update dots
      dots
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d.AMOUNT); } )
          .attr("cy", function (d) { return y(d.overall_score); } )
          .attr("r", 3)
          .style("fill", "#69b3a2");

      dots
        .attr("cx", function (d) { return x(d.AMOUNT); } )
        .attr("cy", function (d) { return y(d.overall_score); } );


      // update x axis
      x.domain([0, d3.max(dataFilter, function(d) {
        return +d.AMOUNT; })])
      svg.select(".myXaxis")
           .transition()
           .duration(1000)
           .attr("opacity", "1")
           .call(d3.axisBottom(x))
           .selectAll("text")
           .attr("y", 0)
           .attr("x", 9)
           .attr("dy", ".35em")
           .attr("transform", "rotate(45)")
           .style("text-anchor", "start");
      // update y axis
      y.domain([0, d3.max(dataFilter, function(d) {
               return +d.overall_score; })])
      yAxis.transition().duration(1000).call(d3.axisLeft(y))

      // svg.append("g")
      // .call(d3.axisLeft(y));
      console.log(d3.max(dataFilter, function(d) {
        return +d.overall_score; }));
      console.log(d3.max(dataFilter, function(d) {
        return +d.AMOUNT; }));
   
    }
    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption)

    console.log(allGroup[0].type)
    console.log(selectedOption.type)
    })















    
    // data=data.filter(function(row){
    //     return row["Account_No"]==="409000611074'";
    //     })
  // Add X axis
//   var x = d3.scaleLinear()
//     .domain([0, 0])
//     .range([ 0, width ]);
//   svg.append("g")
//     .attr("class", "myXaxis")   // Note that here we give a class to the X axis, to be able to call it later and modify it
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x))
//     .attr("opacity", "0")

//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([0, d3.max(dataFilter1, function(d) {
//         return +d.overall_score; })])
//     .range([ height, 0]);
//   svg.append("g")
//     .call(d3.axisLeft(y));


//   // Add dots
//   svg.append('g')
//     .selectAll("dot")
//     .data(dataFilter1)
//     .enter()
//     .append("circle")
//       .attr("cx", function (d) { return x(d.AMOUNT); } )
//       .attr("cy", function (d) { return y(d.overall_score); } )
//       .attr("r", 1.5)
//       .style("fill", "#69b3a2")


//     svg.selectAll("circle")
//     .transition()
//     .delay(function(d,i){return(i*3)})
//     .duration(2000)
//     .attr("cx", function (d) { return x(d.AMOUNT); } )
//     .attr("cy", function (d) { return y(d.overall_score); } )
//   // new X axis
//   x.domain([0, d3.max(dataFilter1,
//    function(d) {
//     return +d.AMOUNT; })])
//   svg.select(".myXaxis")
//     .transition()
//     .duration(2000)
//     .attr("opacity", "1")
//     .call(d3.axisBottom(x));



//     // drop down selection

//     // add the options to the button
//    d3.select("#selectButton")
//    .selectAll('myOptions')
//       .data(allGroup)
//    .enter()
//      .append('option')
//    .text(function (d) { return d; }) // text showed in the menu
//    .attr("value", function (d) { return d; }) // corresponding value returned by the button

// // A function that update the chart
// function update(selectedGroup) {

//    // Create new data with the selection?
//    var  dataFilter =data.filter(function(row){
//         return row["Account_No"]===selectedGroup;
//         })
//    // Give these new data to update scatters

//          // new Y axis
//        y.domain([0, d3.max(dataFilter, function(d) {
//            return +d.overall_score; })])
//        .range([ height, 0]);
//        svg.append("g")
//        .call(d3.axisLeft(y));
//          // new X axis
//        x.domain([0, d3.max(dataFilter, function(d) {
//            return +d.AMOUNT; })])
//        svg.select(".myXaxis")
//            .transition()
//            .duration(2000)
//            .attr("opacity", "1")
//            .call(d3.axisBottom(x));

//    // update dots
//    svg.append('g')
//    .selectAll("dot")
//    .data(dataFilter)
//    .enter()
//    .append("circle")
//      .attr("cx", function (d) { return x(d.AMOUNT); } )
//      .attr("cy", function (d) { return y(d.overall_score); } )
//      .attr("r", 1.5)
//      .style("fill", "#69b3a2")
//     .exit()
//     .remove()



     
//  }

//  // When the button is changed, run the updateChart function
//  d3.select("#selectButton").on("change", function(d) {
//      // recover the option that has been chosen
//      var selectedOption = d3.select(this).property("value")
//      // run the updateChart function with this selected option
//      update(selectedOption)
//     //  console.log("selectedOption")
//  })
})

