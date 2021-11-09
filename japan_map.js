function showJapanMap(svg){
    var tooltip = d3.select("body").append("div").attr("class", "tooltip");
    var selectedPrefecture = null;
    var isSelected = false;

    d3.json("./japan.topojson").then(function(data){
        var japan = topojson.feature(data, data.objects.japan);

        var projection = d3.geoMercator()
            .center([140, 35])
            .translate([width/2, height/2])
            .scale(1500);
        var path = d3.geoPath().projection(projection);

        svg.on("click", clicked);

        var prefectures = svg.selectAll("path")
                        .data(japan.features)
                        .enter().append("g")
                        .attr("class", "prefecture_group");
        
        svg.selectAll(".prefecture_group")
            .append("path")
            .attr("d", path)
            .attr("fill", "ivory")
            .attr("stroke", "#333333")
            .on("mouseover", function(event, d){
                tooltip
                    .style("visibility", "visible")
                    .html(d.properties.nam_ja);
            })
            .on("mousemove", function(event, d){
                tooltip
                    .style("top", (event.pageY - 40) + "px")
                    .style("left", (event.pageX - 30) + "px");
            })
            .on("mouseout", function() {
                tooltip.style("visibility", "hidden");
            })
            .on("click", function(event, d){
                isSelected = true;
                const name = d.properties.nam_ja;
                selectedPrefecture = name;
                svg.selectAll("path")
                    .attr("fill", function(d){
                        return d.properties.nam_ja === name ? "lightgreen" : "ivory";
                    });
            });
        
        const defaultText = "都道府県を選択してください";
        var textShowPrefecture = svg.append("text")
            .attr("x", 20)
            .attr("y", 60)
            .text(defaultText);

        var zoom = d3.zoom()
                    .scaleExtent([1, 10])
                    .on("zoom", function(event){
                        svg.selectAll(".prefecture_group")
                            .attr("transform", event.transform);
                    })
        
        svg.call(zoom);

        function clicked(){
            if (isSelected){
                isSelected = false;
            } else{
                svg.selectAll("path").attr("fill", "ivory");
                selectedPrefecture = null;
            }
            textShowPrefecture.text(function() {
                return selectedPrefecture ? `選択された都道府県：${selectedPrefecture}` : defaultText;
            });
        }
    });
}
