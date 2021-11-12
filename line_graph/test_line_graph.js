var choice_legend;
var true_num;
var colors;
var color_dict;
var genre_list;

function pull_choice_data() {
    choice_legend = JSON.parse(sessionStorage.getItem("choice_genres"));
    true_num = JSON.parse(sessionStorage.getItem("true_num"));
	colors = JSON.parse(sessionStorage.getItem("colors"));
    color_dict = {};
    for (var index in colors) {
        if (colors[index].genre !== undefined) {
            color_dict[colors[index].genre] = index;
        }
    }
}

function push_choice_data() {
    sessionStorage.setItem("choice_genres" , JSON.stringify(choice_legend) );
    sessionStorage.setItem("true_num", true_num);
    sessionStorage.setItem("colors", JSON.stringify(colors));
}

function MakeGraph(data, id){
	pull_choice_data();
	var ganre_list;

	function getPoints(_){
		var zahyou = [];
		ganre_list = []
		for (var g in _) {
			if (choice_legend[g]) { 
				zahyou.push(_[g].map(function(d,j){ return {x:j, y:d};}));
			}
			else {
				zahyou.push(_[g].map(function(d,j){ return {x:j, y:0};}))
			}
			ganre_list.push(g);
		}		
		return zahyou;
	}

	function toComma(x) {    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
		
	var width=400, height=300, margin=20;

	var min_date_list = data.min_date.split("-");
	var max_date_list = data.max_date.split("-");
	dateMin = Number(min_date_list[0]) + 1/12*(Number(min_date_list[1])-1);
	dateMax = Number(max_date_list[0]) + 1/12*(Number(max_date_list[1])-1);
	var maxT = 0;
	var minT = 0;
	var type = "dist";
	for (var g in data[type]) {
		var M = d3.max(data[type][g]);
		maxT = M > maxT ? M : maxT;
		var m = d3.min(data[type][g]);
		minT = m < minT ? m : minT;
	}

	
	function draw(){
		
		function tW(d){ return x(d); }
		function tH(d){ return y(minT + d*(maxT-minT)/50); }
		
		var svg =d3.select("#"+id).select("."+type);
		
		//x and y axis maps.
		var x = d3.scaleLinear().domain([0, data.data_num - 1]).range([0, width]);
		var y = d3.scaleLinear().domain([minT, maxT]).range([height, 0]);
		
		//draw yellow background for graph.
		svg.append("rect").attr("x",0).attr("y",0).attr("width",width).attr("height",height).style("fill","rgb(235,235,209)");
		
		// draw vertical lines of the grid.
		svg.selectAll(".vlines").data(d3.range(data.data_num)).enter().append("line").attr("class","vlines")
			.attr("x1",tW).attr("y1",0)
			.attr("x2", tW).attr("y2",function(d,i){ return  (Number(min_date_list[1]) + d) % 12 == 1 && (Number(min_date_list[1]) + d) % 12 != 1? height+12: height;});
		
		//draw horizontal lines of the grid.
		svg.selectAll(".hlines").data(d3.range(51)).enter().append("line").attr("class","hlines")
			.attr("x1",function(d,i){ return d%10 ==0 && d!= 50? -12: 0;})
			.attr("y1",tH).attr("x2", width).attr("y2",tH);
			
		// make every 10th line in the grid darker.	
		svg.selectAll(".hlines").filter(function(d){ return d%10==0}).style("stroke-opacity",0.7);
		svg.selectAll(".vlines").filter(function(d){ return (Number(min_date_list[1]) + d) % 12 == 1}).style("stroke-opacity",0.7);
		
		function getHLabel(d,i){
			if(type=="dist"){ // for distribution graph use the min and max to get the 5 label values.
				var r= dateMin +d*(1/12); 
				var year = Math.trunc(r);
				return year;
			}
		}
		
		function getVLabel(d,i){
			if(type=="dist"){ // for dist use the maximum for sum of frequencies and divide it into 5 pieces.
				return Math.round(minT + (maxT - minT)*i/5);
			}
		}
		// add horizontal axis labels
		svg.append("g").attr("class","hlabels")
			.selectAll("text").data(d3.range(data.data_num).filter(function(d){ return (Number(min_date_list[1]) + d) % 12 == 1;})).enter().append("text")
			.text(getHLabel).attr("x",function(d,i){ return tW(d)+5;}).attr("y",height+14);	
			
		// add vertical axes labels.
		svg.append("g").attr("class","vlabels")
			.selectAll("text").data(d3.range(41).filter(function(d){return d%10==0; })).enter().append("text")
			.attr("transform",function(d,i){ return "translate(-10,"+(tH(d)-14)+")rotate(-90)";})
			.text(getVLabel).attr("x",-10).attr("y",function(d){ return 5;});	
		
		var graph_line = d3.line().x(function(d) {return x(d.x); })
			.y(function(d) { return y(d.y); });

		var dataset = getPoints(data[type]);

		svg.selectAll("path").data(dataset).enter()
			.append("path").attr("d", graph_line)
			.attr("stroke-width",function(d, i) {
				if (choice_legend[ganre_list[i]]) {
					return 2;
				}
				return 0;
			})
			.attr("stroke", function(d, i) {
				if (choice_legend[ganre_list[i]]) {
					return colors[color_dict[ganre_list[i]]].color;
				}
				return "#000000";
			})
			.attr("fill", "none");

			
	}
	
	function transitionDefault(){
		
		function tW(d){ return x(d); }
		function tH(d){ return y(minT + d*(maxT-minT)/50); }

		var x = d3.scaleLinear().domain([0, data.data_num - 1]).range([0, width]);
		var y = d3.scaleLinear().domain([minT, maxT]).range([height, 0]);


		// transition the lines, areas, and labels.
		var svg = d3.select("#"+id).select("."+type);	

		var graph_line = d3.line().x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); });

		var dataset = getPoints(data[type]);

		svg.selectAll("path")
			.data(dataset)
			.transition().duration(500)
			.attr("d", graph_line)
			.attr("stroke-width",function(d, i) {
				if (choice_legend[ganre_list[i]]) {
					return 2;
				}
				return 0;
			})
			.attr("stroke", function(d, i) {
				if (choice_legend[ganre_list[i]]) {
					return colors[color_dict[ganre_list[i]]].color;
				}
				return "#000000";
			})
			.attr("fill", "none");

		svg.selectAll(".vlines").transition().duration(500).attr("x1",tW).attr("x2", tW);			
		svg.selectAll(".hlines").transition().duration(500).attr("y1",tH).attr("y2",tH);			
		svg.selectAll(".vlabels").selectAll("text").transition().duration(500)
			.attr("transform",function(d,i){ return "translate(-10,"+(tH(d)-14)+")rotate(-90)";});	
			
	}


    function transitionClick(){
        if (true_num == 0) {
            transitionDefault();
            return;
        }
		var maxCurrent = 0;
		var minCurrent = 0;
		for (var g in data[type]) {
			if (choice_legend[g]) {
				var M = d3.max(data[type][g]);
				maxCurrent = M > maxCurrent ? M : maxCurrent;
				var m = d3.min(data[type][g]);
				minCurrent = m < minCurrent ? m : minCurrent;
			}
		}
		
		var x = d3.scaleLinear().domain([0, data.data_num - 1]).range([0, width]);
		var y = d3.scaleLinear().domain([minCurrent, maxCurrent]).range([height, 0]);
		
		function tW(d){ return x(d); }
		function tH(d){ return y(minT + d*(maxT-minT)/50); }

		var svg = d3.select("#"+id).select("."+type);
		//transition all the lines, labels, and areas.
		var graph_line = d3.line().x(function(d) {return x(d.x); })
			.y(function(d) { return y(d.y); });

		var dataset = getPoints(data[type]);

		svg.selectAll("path")
			.data(dataset)
			.transition().duration(500)
			.attr("d", graph_line).attr("fill", "none")
			.attr("stroke-width",function(d, i) {
				if (choice_legend[ganre_list[i]]) {
					return 2;
				}
				return 0;
			})
			.attr("stroke", function(d, i) {
				if (choice_legend[ganre_list[i]]) {
					return colors[color_dict[ganre_list[i]]].color;
				}
				return "#000000";
			});

			
		svg.selectAll(".vlines").transition().duration(500).attr("x1",tW).attr("x2", tW);			
		svg.selectAll(".hlines").transition().duration(500).attr("y1",tH).attr("y2",tH);						
		svg.selectAll(".vlabels").selectAll("text").transition().duration(500)
			.attr("transform",function(d,i){ return "translate(-10,"+(tH(d)-14)+")rotate(-90)";});	
		
	}

	// add title.
	d3.select("#"+id).append("h3").text("全国の店舗数遷移");
	
	// add svg and set attributes for distribution.
	d3.select("#"+id).append("svg").attr("width",width+2*margin).attr("height",height+2*margin)
		.append("g").attr("transform","translate("+margin+","+margin+")").attr("class","dist");
		
	// Draw the a graph.
	draw("dist");			
        
    
	// draw legends.
	var legRow = d3.select("#"+id).append("div").attr("class","legend")
		.append("table").selectAll("tr").data(data.genre).enter().append("tr").append("td");
    legRow.append("div")
        .style("background",function(d){ 
            if (choice_legend[d]) {
                return colors[color_dict[d]].color;
            }
            return "#FFFFFF";})
        .style("cursor","pointer")
		.on("click", function(event,d) {
			pull_choice_data();
            if (choice_legend[d]) {
				choice_legend[d] = false;
				colors[color_dict[d]].genre = undefined;
                true_num--;
            }
            else {
				choice_legend[d] = true;
				for (var index in colors) {
					if (colors[index].genre === undefined) {
						colors[index].genre = d;
						color_dict[d] = index;
						break;
					}
				}
                true_num++;
            }
            push_choice_data();
            legRow.style("background-color", function(d) {
                    if (choice_legend[d]) {
                        return "skyblue";
                    }
                    return "white";
                });
            legRow.selectAll("div")
                .style("background",function(d){ 
                    if (choice_legend[d]) {
                        return colors[color_dict[d]].color;
                    }
                    return "#FFFFFF";
                });	
			transitionClick();
        });
		
    legRow.append("span").text(function(d){ return d;})
        .style("cursor","pointer")
		.on("click", function(event,d) {
            pull_choice_data();
            if (choice_legend[d]) {
				choice_legend[d] = false;
				colors[color_dict[d]].genre = undefined;
                true_num--;
            }
            else {
				choice_legend[d] = true;
				for (var index in colors) {
					if (colors[index].genre === undefined) {
						colors[index].genre = d;
						color_dict[d] = index;
						break;
					}
				}
                true_num++;
            }
            push_choice_data();
            legRow.style("background-color", function(d) {
                    if (choice_legend[d]) {
                        return "skyblue";
                    }
                    return "white";
                });
            legRow.selectAll("div")
                .style("background",function(d){ 
                    if (choice_legend[d]) {
                        return colors[color_dict[d]].color;
                    }
                    return "#FFFFFF";
                });	
			transitionClick();
        });
    
}

function drawAll(data, id){
    import("../d3.js").then(module => {
        var seg = d3.select("#"+id).selectAll("div").data(d3.range(data.length)).enter()
            .append("div").attr("id",function(d,i){ return "segment"+i;}).attr("class","shopdatadiv");
            
        d3.range(data.length).forEach(function(d,i){MakeGraph(data[i], "segment"+i );});
    });
}
