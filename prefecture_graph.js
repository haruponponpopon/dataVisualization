var choice_legend;
var true_num;
var colors;
var color_dict;
var genre_list;
var dateMax;
var dateMin;
var graph_width=400, graph_height=300, graph_margin=50;
var current_pre;
var memori_line_p, memori_label_p, vline_upper_p, vline_lower_p;

function pull_choice_data_pre() {
    choice_legend = JSON.parse(sessionStorage.getItem("choice_genres"));
    true_num = JSON.parse(sessionStorage.getItem("true_num"));
	colors = JSON.parse(sessionStorage.getItem("colors"));
    color_dict = JSON.parse(sessionStorage.getItem("color_dict"));
}


function currentVline() {
	var current_date = JSON.parse(sessionStorage.getItem("current_date"));
	return (current_date - dateMin) / (dateMax - dateMin) * graph_width;
}

function CalcMemoriPre(maxT, minT) {
	var order = maxT - minT;
	if (order <= 50) {
		memori_line_p = 1;
		if (order <= 10) {
			memori_label_p = 1;
		}
		else {
			memori_label_p = 5;
		}
	} 
	else if (order <= 250) {
		memori_line_p = 5;
		if (order <= 150) {
			memori_label_p = 10;
		}
		else {
			memori_label_p = 50;
		}
	}
	else if(order <= 500) {
		memori_line_p = 10;
		memori_label_p = 50;
	}
	else if(order <= 2500) {
		memori_line_p = 50;
		if (order <= 1500) {
			memori_label_p = 100;
		}
		else {
			memori_label_p = 500;
		}
	}
	else {
		memori_line_p = 100;
		memori_label_p = 500;
	}
	vline_upper_p = maxT > 0 ? Math.floor(maxT / memori_line_p) + 1 : 0;
	vline_lower_p = minT < 0 ? Math.floor(-minT / memori_line_p) + 1 : 0;
}

function calcZahyouPre (index) {
	return -1 * vline_lower_p * memori_line_p + index*memori_line_p;
}

function resetVlinesPre(svg) {
	if (svg.selectAll(".hlinesPre").size()) {
		svg.selectAll(".hlinesPre").remove();
	}
	if (svg.selectAll(".vlabelsPre").size()) {
		svg.selectAll(".vlabelsPre").remove();
	}
}

function MakeGraphPre(data, id){
    pull_choice_data_pre();
    var type = "dist";
    var ganre_list;
    var pre_data = data[type][current_pre];

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

		
	var maxT = 0;
	var minT = 0;
	for (var g in pre_data) {
		var M = d3.max(pre_data[g]);
		maxT = M > maxT ? M : maxT;
		var m = d3.min(pre_data[g]);
		minT = m < minT ? m : minT;
    }
	
	function draw(){
		CalcMemoriPre(maxT, minT);
        function tH(d){ return y(calcZahyouPre(d)); }
		
        var svg =d3.select("#"+id).select(".distPre");
		resetVlinesPre(svg);
		
		//x and y axis maps.
		var x = d3.scaleLinear().domain([0, data.data_num - 1]).range([0, graph_width]);
		var y = d3.scaleLinear().domain([-1 * vline_lower_p * memori_line_p, vline_upper_p * memori_line_p]).range([graph_height, 0]);
		
        //draw horizontal lines of the grid.
		svg.selectAll(".hlinesPre").data(d3.range(vline_lower_p+vline_upper_p+1)).enter().append("line").attr("class","hlinesPre")
		.attr("x1",function(d,i){ return calcZahyouPre(d)%memori_label_p == 0 && d!= vline_lower_p+vline_upper_p? -12: 0;})
		.attr("y1",tH).attr("x2", graph_width).attr("y2",tH);
        
        // make every 10th line in the grid darker.	
        svg.selectAll(".hlinesPre").filter(function(d){ return calcZahyouPre(d)%memori_label_p == 0}).style("stroke-opacity",0.7);
		
		function getVLabel(d,i){
			return calcZahyouPre(d);
		}

		svg.append("g").attr("class","vlabelsPre")
			.selectAll("text").data(d3.range(vline_lower_p+vline_upper_p+1).filter(function(d){return calcZahyouPre(d)%memori_label_p==0;}))
			.enter().append("text")
			.attr("transform",function(d,i){ return "translate(-10,"+(tH(d)-14)+")rotate(-90)";})
			.attr("fill", "white").text(getVLabel).attr("x",-10).attr("y",function(d){ return 5;});	

		
		var graph_line = d3.line().x(function(d) {return x(d.x); })
			.y(function(d) { return y(d.y); });

        var dataset = getPoints(pre_data);

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
		
	// Draw the a graph.
    draw();			
    
}

function InitGraphPre(data, id){
    // add title.
    d3.select("#"+id).append("h3").style("letter-spacing", "0.3em").style("text-decoration", "underline").text("都道府県ごとの店舗数遷移");

    // add svg and set attributes for distribution.
    d3.select("#"+id).append("svg").attr("width",graph_width+graph_margin).attr("height",graph_height+2*graph_margin)
        .append("g").attr("transform","translate("+graph_margin+","+graph_margin+")").attr("class","distPre");
        

    var svg =d3.select("#"+id).select(".distPre");
    function tW(d){ return x(d); }

    var min_date_list = data.min_date.split("-");
    var max_date_list = data.max_date.split("-");
    dateMin = Number(min_date_list[0]) + 1/12*(Number(min_date_list[1])-1);
    dateMax = Number(max_date_list[0]) + 1/12*(Number(max_date_list[1])-1);

    //x and y axis maps.
    var x = d3.scaleLinear().domain([0, data.data_num - 1]).range([0, graph_width]);

    //draw yellow background for graph.
    svg.append("rect").attr("x",0).attr("y",0).attr("width",graph_width).attr("height",graph_height).style("fill","rgb(235,235,209)");

    // draw vertical lines of the grid.
    svg.selectAll(".vlinesPre").data(d3.range(data.data_num)).enter().append("line").attr("class","vlinesPre")
        .attr("x1",tW).attr("y1",0)
        .attr("x2", tW).attr("y2",function(d,i){return  (Number(min_date_list[1]) + d) % 12 == 1 && (Number(min_date_list[1]) + d) % 12 != 1? graph_height+12: graph_height;});

            
    // make every 10th line in the grid darker.	
    svg.selectAll(".vlinesPre").filter(function(d){ return (Number(min_date_list[1]) + d) % 12 == 1}).style("stroke-opacity",0.7);
    svg.selectAll(".hlinesPre").data(d3.range(51)).enter().append("line").attr("class","hlinesPre")
		.attr("x1",0).attr("y1",graph_height).attr("x2", graph_width).attr("y2",graph_height);

    svg.selectAll(".selectDatePre").data(d3.range(1)).enter().append("line").attr("class", "selectDatePre")
        .attr("y1",0).attr("y2", graph_height)
        .attr("x1",currentVline).attr("x2",currentVline)
        .attr("stroke", "red").attr("stroke-width", 1);

    function getHLabel(d,i){
        var r= dateMin +d*(1/12); 
        var year = Math.trunc(r);
        return year;
    }

    // add horizontal axis labels
    svg.append("g").attr("class","hlabelsPre")
        .selectAll("text").data(d3.range(data.data_num).filter(function(d){ return (Number(min_date_list[1]) + d) % 12 == 1;})).enter().append("text")
		.attr("fill", "white").text(getHLabel).attr("x",function(d,i){ return tW(d)+5;}).attr("y",graph_height+14);
		
	svg.append("g").attr("class","htitlePre").selectAll("text").data(d3.range(1)).enter().append("text").attr("x", graph_width/2).attr("y", graph_height+30)
		.attr("font-size",15).attr("fill", "white").text("年");

	svg.append("g").attr("class","vtitle").selectAll("text").data(d3.range(1)).enter().append("text").attr("x", -30).attr("y", 0)
		.attr("transform","translate(-30,"+ graph_height/2 +"),rotate(-90)").attr("font-size",15).attr("fill", "white").text("店舗数");
        
}

function updateGraphPre(data, id) {
	if (current_pre == undefined) {
		d3.select("#"+id).select("h3").style("letter-spacing", "0.3em").style("text-decoration", "underline").text("都道府県ごとの店舗数遷移");
	}
	else {
		d3.select("#"+id).select("h3").style("letter-spacing", "0.3em").style("text-decoration", "underline").text(current_pre + "の店舗数遷移");
	}
    pull_choice_data_pre();
    var type = "dist";
    var ganre_list;
    var pre_data = data[type][current_pre];

	var svg = d3.select("#"+id).select(".distPre");
	resetVlinesPre(svg);
	var tooltip = d3.select(".tooltip");

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
		
	var maxT = 0;
	var minT = 0;
	for (var g in pre_data) {
		var M = d3.max(pre_data[g]);
		maxT = M > maxT ? M : maxT;
		var m = d3.min(pre_data[g]);
		minT = m < minT ? m : minT;
    }
    function transitionDefault(){
		CalcMemoriPre(maxT, minT);
		function tW(d){ return x(d); }
		function tH(d){ return y(calcZahyouPre(d)); }

		var x = d3.scaleLinear().domain([0, data.data_num - 1]).range([0, graph_width]);
		var y = d3.scaleLinear().domain([-1 * vline_lower_p * memori_line_p, vline_upper_p * memori_line_p]).range([graph_height, 0]);

        //draw horizontal lines of the grid.
		svg.selectAll(".hlinesPre").data(d3.range(vline_lower_p+vline_upper_p+1)).enter().append("line").attr("class","hlinesPre")
		.attr("x1",function(d,i){ return calcZahyouPre(d)%memori_label_p == 0 && d!= vline_lower_p+vline_upper_p? -12: 0;})
		.attr("y1",tH).attr("x2", graph_width).attr("y2",tH);
		// make every 10th line in the grid darker.	
		svg.selectAll(".hlinesPre").filter(function(d){ return calcZahyouPre(d)%memori_label_p == 0}).style("stroke-opacity",0.7);
		
		function getVLabel(d,i){
			return calcZahyouPre(d);
		}

		svg.append("g").attr("class","vlabelsPre")
			.selectAll("text").data(d3.range(vline_lower_p+vline_upper_p+1).filter(function(d){return calcZahyouPre(d)%memori_label_p==0;}))
			.enter().append("text")
			.attr("transform",function(d,i){ return "translate(-10,"+(tH(d)-14)+")rotate(-90)";})
			.attr("fill", "white").text(getVLabel).attr("x",-10).attr("y",function(d){ return 5;});	

		// transition the lines, areas, and labels.

		var graph_line = d3.line().x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); });

		var dataset = getPoints(pre_data);

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

		svg.selectAll(".vlinesPre").transition().duration(500).attr("x1",tW).attr("x2", tW);			
	}


    function transitionClick(){
        if (true_num == 0) {
            transitionDefault();
            return;
        }
		var maxCurrent = 0;
		var minCurrent = 0;
		for (var g in pre_data) {
			if (choice_legend[g]) {
				var M = d3.max(pre_data[g]);
				maxCurrent = M > maxCurrent ? M : maxCurrent;
				var m = d3.min(pre_data[g]);
				minCurrent = m < minCurrent ? m : minCurrent;
			}
		}
		CalcMemoriPre(maxCurrent, minCurrent);
		
		var x = d3.scaleLinear().domain([0, data.data_num - 1]).range([0, graph_width]);
		var y = d3.scaleLinear().domain([-1 * vline_lower_p * memori_line_p, vline_upper_p * memori_line_p]).range([graph_height, 0]);
		
		function tW(d){ return x(d); }
		function tH(d){ return y(calcZahyouPre(d)); }

		//draw horizontal lines of the grid.
		svg.selectAll(".hlinesPre").data(d3.range(vline_lower_p+vline_upper_p+1)).enter().append("line").attr("class","hlinesPre")
		.attr("x1",function(d,i){ return calcZahyouPre(d)%memori_label_p == 0 && d!= vline_lower_p+vline_upper_p? -12: 0;})
		.attr("y1",tH).attr("x2", graph_width).attr("y2",tH);
		// make every 10th line in the grid darker.	
		svg.selectAll(".hlinesPre").filter(function(d){ return calcZahyouPre(d)%memori_label_p == 0}).style("stroke-opacity",0.7);
		
		function getVLabel(d,i){
			return calcZahyouPre(d);
		}

		svg.append("g").attr("class","vlabelsPre")
			.selectAll("text").data(d3.range(vline_lower_p+vline_upper_p+1).filter(function(d){return calcZahyouPre(d)%memori_label_p==0 || calcZahyouPre(d) == 0;}))
			.enter().append("text")
			.attr("transform",function(d,i){ return "translate(-10,"+(tH(d)-14)+")rotate(-90)";})
			.attr("fill", "white").text(getVLabel).attr("x",-10).attr("y",function(d){ return 5;});	

		//transition all the lines, labels, and areas.
		var graph_line = d3.line().x(function(d) {return x(d.x); })
			.y(function(d) { return y(d.y); });

		var dataset = getPoints(pre_data);

		svg.selectAll("path")
			.data(dataset)
			.on("mouseover", function(event, d) {
				var sa = Math.round((current_date - dateMin)*12);
				var now_g = ganre_list[event.target.id];
				var now_data = pre_data[now_g][sa];
				tooltip.style("visibility", "visible")
					.html(function() {
						return now_g +" (" + current_year+"年" + current_month + "月)  :<br>   "+  now_data + "件";
					});
			})
			.on("mousemove", function(event, d) {
				tooltip
					.style("top", (event.pageY - 20) + "px")
					.style("left", (event.pageX + 10) + "px");
			})
			.on("mouseout", function(event, d) {
				tooltip.style("visibility", "hidden");
			})
			.transition().duration(500)
			.attr("d", graph_line).attr("fill", "none")
			.attr("id", function(d,i){
				return i;
			})
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

			
		svg.selectAll(".vlinesPre").transition().duration(500).attr("x1",tW).attr("x2", tW);			
    }
    transitionClick();

}


function drawAllPre(data, id){
    current_pre = sessionStorage.getItem("current_pre");
    if (current_pre !== undefined) {      
		d3.range(data.length).forEach(function(d,i){MakeGraphPre(data[i], "segmentPre"+i );});
		updateGanrePre(data, id);
	}
	else {
		d3.range(data.length).forEach(function(d,i){InitGraphPre(data[i], "segmentPre"+i );});
	}
}

function initAllPre(data, id) {
    var seg = d3.select("#"+id).selectAll("div").data(d3.range(data.length)).enter()
        .append("div").attr("id",function(d,i){ return "segmentPre"+i;}).attr("class","shopdatadivPre");

    d3.range(data.length).forEach(function(d,i){InitGraphPre(data[i], "segmentPre"+i );});

}

function updateGanrePre(data, id){
    d3.range(data.length).forEach(function(d,i){updateGraphPre(data[i], "segmentPre"+i );});
}


function updateVlinePre(input_data, id){
	var svg = d3.select("#"+id).select("."+"distPre");	
	svg.selectAll(".selectDatePre").transition().duration(50)
		.attr("x1",currentVline).attr("x2",currentVline);
}