const svg=d3.select("svg"), padding=200;
const width=svg.attr("width")-padding, height=svg.attr("height")-padding;
const g=svg.append("g").attr("transform","translate("+ 100 +","+ 100 +")");
            
fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
   .then(response=>response.json())
   .then(response=>{
       const {baseTemperature, monthlyVariance}=response;
       const data=monthlyVariance.map(d=>({
           ...d,
           temp: baseTemperature - d.variance
       }))
       
    //XSCALE
    const xScale = d3.scaleTime()
                     .domain([d3.min(monthlyVariance, d=>d.year), d3.max(monthlyVariance, d=>d.year)])
                     .range([0, width]);
    g.append("g").attr("id","x-axis")
                 .attr("transform","translate(0, "+ height +")")
                 .call(d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(20));

    //YSCALE
    const yScale=d3.scaleLinear()
                   .domain([0, 11])
                   .range([0, height]);
    g.append("g").attr("id","y-axis").call(d3.axisLeft(yScale).tickFormat(month=>{
        const date=new Date();
        date.setUTCMonth(month);
        return d3.timeFormat("%B")(date);
    }));
    //color
    const color=d3.scaleOrdinal(["#C0C0C0","#808080",,"#FFFF00", "#808000","#008000","#800000","#FF0000"]);

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


        //const tooltip=d3.select("body").append("div").attr("class","tooltip").attr("id", "tooltip").style("opacity", 0);
  
    g.selectAll("rect")
       .data(data)
       .enter()
       .append("rect")
       .attr("class","cell")
       .attr("data-month", d=>d.month)
       .attr("data-year", d=>d.year)
       .attr("data-temp", d=>d.baseTemperature)
       .attr("x", d=>xScale(d.year))
       .attr("y", d=>yScale(d.month - 1))
       .attr("width", 10)
       .attr("height", 10)
       .attr("fill",d=>{
            return d=>color(d.baseTemperature)
        })
        //     .on("mouseover", d => { 
        //      tooltip.style("opacity", 0.9);
        //      tooltip.attr("data-year", d.Year);
        //      tooltip.html(d.Name + ", "+ d.Nationality +"<br />"+"Year: "+ d.Year + ', Time: ' +d.Time +"<br />"+d.Doping)
        //     .style("left", d3.event.pageX + "px")
        //     .style("top", d3.event.pageY - 28 + "px");
        //     })   
        //     .on("mouseout", d => {
        //      tooltip.style("opacity", 0);
        //     });
     });
     