function showJapanMap(svg){
    d3.json("./japan.topojson").then(function(data){
        var japan = topojson.feature(data, data.objects.japan);

        var projection = d3.geoMercator()
            .center([140, 35])
            .translate([width/2, height/2])
            .scale(1500);
        var path = d3.geoPath().projection(projection);
        
        svg.selectAll("path")
            .data(japan.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("fill", "lightgreen")
            .attr("stroke", "#333333");
    });
}