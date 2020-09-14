const svg=d3.select("svg"), padding=200;
const width=svg.attr("width")-padding, height=svg.attr("height")-padding;
const g=svg.append("g").attr("transform","translate("+ 100 +","+ 100 +")");
//const colors = ["#2257AF", "#448AFF", "#8CB5F9", "#D1DFF7", "#F9EDCB", "#FADD8B", "#FAD366", "#FAAC60", "#CC6942", "#D32F2F", "#B21C1C"];   
const colors = ["#2257AF", "#448AFF", "#8CB5F9", "#D1DFF7", "#F9EDCB", "#FADD8B", "#FAD366", "#FAAC60", "#CC6942", "#D32F2F", "#B21C1C"];
const months= ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
   .then(response=>response.json())
   .then(response=>{
       const {baseTemperature, monthlyVariance}=response;
       const temperature=monthlyVariance.map(d=>({...d,newTemperature: baseTemperature - d.variance}))
       
    //XSCALE
    const xScale = d3.scaleTime()
                     .domain([d3.min(temperature, d=>d.year), d3.max(temperature, d=>d.year)])
                     .range([width, 0]);
    g.append("g").attr("id","x-axis")
                 .attr("transform","translate(0, "+ height +")")
                 .call(d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(20));

    //YSCALE
    const yScale=d3.scaleLinear()
                   .domain([0, 11])
                   .range([0, height]);
    g.append("g").attr("id","y-axis").call(d3.axisLeft(yScale)
    .tickFormat(month=>{
        const date=new Date();
        date.setUTCMonth(month);
        return d3.timeFormat("%B")(date);
    }).ticks(10));

    //color SCALE 
    const colorScale=d3.scaleLinear()
                       .domain([d3.min(temperature, d=>d.newTemperature), d3.max(temperature, d=>d.newTemperature)])
                       .range([0, 11]);

    //TITLE
    svg.append("text")
        .attr("id","title")
        .attr("transform", 'translate(100, 100)')
        .attr("x", 200)
        .attr("y", -30)
        .attr("font-size", "24px")
        .text("Monthly Global Land-Surface Temperature");
    
     //DESCRIPTION
     svg.append("text")
     .attr("id","description")
     .attr("transform", 'translate(100, 100)')
     .attr("x", 300)
     .attr("y", -5)
     .attr("font-size", "15px")
     .text("1753 - 2015: base temperature 8.66℃");
    
    //MONTHS LABEL
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -250)
        .attr("y", 120)
        .attr("dy", "-5.1em")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .style("font-size", "14px")
        .text("Months");


    const tooltip=d3.select("body").append("div").attr("class","tooltip").attr("id", "tooltip").style("opacity", 0);
  
    g.selectAll("rect")
       .data(temperature)
       .enter()
       .append("rect")
       .attr("class","cell")
       .attr("data-month", d=>d.month - 1)
       .attr("data-year", d=>d.year)
       .attr("data-temp", d=>d.newTemperature)
       .attr("x", d=>xScale(d.year))
       .attr("y", d=>yScale(d.month - 1))
       .attr("width", 10)
       .attr("height", height / colors.length)
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
     });
     const legend=d3.select("body")
                    .append("svg")
                    .attr("width", 220)
                    .attr("height", 50)
                    .attr("id","legend")
                    .selectAll("rect")
                    .data(colors)
                    .enter()
                    .append("rect")
                    .attr("x", (d, i)=> i * 20)
                    .attr("y", 0)
                    .attr("width", width / colors.length)
                    .attr("height", 50)
                    .attr("fill", d=>d)
                     .text("heeh")
     