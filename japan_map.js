function showJapanMap(svg){
    d3.json("./japan.topojson").then(function(data){
        var japan = topojson.feature(data, data.objects.japan);

        var projection = d3.geoMercator()
            .center([140, 35])
            .translate([width/2, height/2])
            .scale(1500);
        var path = d3.geoPath().projection(projection);
        
        prefectures = svg.selectAll("path")
                        .data(japan.features)
                        .enter().append("g")
                        .attr("class", "prefecture_group");
        
        svg.selectAll(".prefecture_group")
            .append("path")
            .attr("d", path)
            .attr("fill", "ivory")
            .attr("stroke", "#333333");

        var zoom = d3.zoom()
                    .scaleExtent([0.25, 10])
                    .on("zoom", function(event){
                        svg.selectAll(".prefecture_group")
                            .attr("transform", event.transform);
                    })
        
        svg.call(zoom);
    });
}
