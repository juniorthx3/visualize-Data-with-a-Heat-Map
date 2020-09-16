const svg=d3.select("svg"), padding=200;
const width=svg.attr("width")-padding, height=svg.attr("height")-padding;
const g=svg.append("g").attr("transform","translate("+ 100 +","+ 90 +")");  
const colors = ["#2257AF", "#448AFF", "#8CB5F9", "#D1DFF7", "#F9EDCB", "#FADD8B", "#FAD366", "#FAAC60", "#CC6942", "#D32F2F", "#B21C1C"];
const months= ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const xScale=d3.scaleBand().range([])

//TITLE
svg.append("text")
   .attr("id","title")
   .attr("transform", 'translate(100, 100)')
   .attr("x", 200)
   .attr("y", -50)
   .attr("font-size", "24px")
   .text("Monthly Global Land-Surface Temperature");

//DESCRIPTION
svg.append("text")
   .attr("id","description")
   .attr("transform", 'translate(100, 100)')
   .attr("x", 300)
   .attr("y", -25)
   .attr("font-size", "15px")
   .text("1753 - 2015: base temperature 8.66℃");


fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
   .then(response=>response.json())
   .then(response=>{
       const {baseTemperature, monthlyVariance}=response;
       const temperature=monthlyVariance.map(d=>({...d, newTemperature: baseTemperature - d.variance}))
       const tooltip=d3.select("body").append("div").attr("class","tooltip").attr("id", "tooltip").style("opacity", 0);
       const legendScale=d3.scaleBand().domain([2.8, 3.9, 5.0, 6.1, 7.2, 8.3 ,9.5 ,10.6 ,11.7 ,12.8]).range([0, (height + 16)])
       
    //XSCALE
    const xScale = d3.scaleLinear()
                     .domain([d3.min(temperature, d=>d.year), d3.max(temperature, d=>d.year)])
                     .range([0, width]);
                     
    g.append("g").attr("id","x-axis")
                 .attr("transform","translate(0, "+ height +")")
                 .call(d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(20));

    //YSCALE
    const yScale=d3.scaleBand()
                   .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ,11])
                   .range([0, height]);
     g.append("g").attr("id","y-axis").call(d3.axisLeft(yScale)
     .tickFormat(month=>{
        const date=new Date();
        date.setUTCMonth(month);
        return d3.timeFormat("%B")(date);
    }));
    //color SCALE 
    const colorScale=d3.scaleLinear()
                       .domain([d3.min(temperature, d=>d.newTemperature), d3.max(temperature, d=>d.newTemperature)])
                       .range([0, 11]);

    //MONTHS LABEL
    svg.append("text")
       .attr("transform", "rotate(-90)")
       .attr("x", -250)
       .attr("y", 120)
       .attr("dy", "-5.1em")
       .attr("text-anchor", "middle")
       .attr("stroke", "black")
       .style("font-size", "12px")
       .text("Months");

   //YEAR LABEL
   svg.append("text")
      .attr("id","title")
      .attr("transform", 'translate(100, 550)')
      .attr("x", 700)
      .attr("y", -70)
      .attr("stroke", "black")
      .attr("font-size", "12px")
      .text("Year"); 
    
   //DATA RECT
    g.selectAll(".cell")
       .data(temperature)
       .enter()
       .append("rect")
       .attr("class","cell")
       .attr("data-month", d=>d.month - 1)
       .attr("data-year", d=>d.year)
       .attr("data-temp", d=>d.newTemperature)
       .attr("x", d=>xScale(d.year) + 1)
       .attr("y", d=>yScale(d.month - 1))
       .attr("width", 5)
       .attr("height",yScale.bandwidth())
       .attr("fill",d=>colors[Math.floor(colorScale(d.newTemperature))])
        .on("mouseover", d => { 
             tooltip.style("opacity", 0.9);
             tooltip.attr("data-year", d.year);
             tooltip.html(d.year + ", "+ months[d.month - 1] +"<br />"+ d.newTemperature + " ℃"+"<br />"+ d.variance)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");
            })   
        .on("mouseout", d => {
             tooltip.style("opacity", 0);
        });

   //LEGEND
     svg.append("g")
        .attr("id","legend")
        .attr("transform","translate(100, 470)")
        .selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
        .attr("x", (d, i)=> i * 33)
        .attr("y", 0)
        .attr("width", 36.66)
        .attr("height", 30)
        .attr("fill", d=>d);
        
     svg.append("g").attr("transform","translate(100, 500)").call(d3.axisBottom(legendScale));
       
     });
                
     