var choice_legend;
var true_num;
var colors;
var color_dict;
var genre_list;
var dateMax;
var dateMin;
var graph_width=400, graph_height=300, graph_margin=50;
var memori_line, memori_label, vline_upper, vline_lower;

function pull_choice_data() {
    choice_legend = JSON.parse(sessionStorage.getItem("choice_genres"));
    true_num = JSON.parse(sessionStorage.getItem("true_num"));
	colors = JSON.parse(sessionStorage.getItem("colors"));
	color_dict = JSON.parse(sessionStorage.getItem("color_dict"));
}

function push_choice_data() {
    sessionStorage.setItem("choice_genres" , JSON.stringify(choice_legend) );
    sessionStorage.setItem("true_num", true_num);
	sessionStorage.setItem("colors", JSON.stringify(colors));
	sessionStorage.setItem("color_dict", JSON.stringify(color_dict));
}

function currentVline() {
	var current_date = JSON.parse(sessionStorage.getItem("current_date"));
	return (current_date - dateMin) / (dateMax - dateMin) * graph_width;
}

function CalcMemori(maxT, minT) {
	var order = maxT - minT;
	if (order <= 50) {
		memori_line = 1;
		if (order <= 10) {
			memori_label = 1;
		}
		else {
			memori_label = 5;
		}
	} 
	else if (order <= 250) {
		memori_line = 5;
		if (order <= 150) {
			memori_label = 10;
		}
		else {
			memori_label = 50;
		}
	}
	else if(order <= 500) {
		memori_line = 10;
		memori_label = 50;
	}
	else if(order <= 2500) {
		memori_line = 50;
		if (order <= 1500) {
			memori_label = 100;
		}
		else {
			memori_label = 500;
		}
	}
	else {
		memori_line = 100;
		memori_label = 500;
	}
	vline_upper = maxT > 0 ? Math.floor(maxT / memori_line) + 1 : 0;
	vline_lower = minT < 0 ? Math.floor(-minT / memori_line) + 1 : 0;
}

function calcZahyou (index) {
	return -1 * vline_lower * memori_line + index*memori_line;
}

function resetVlines(svg) {
	if (svg.selectAll(".hlines").size()) {
		svg.selectAll(".hlines").remove();
	}
	if (svg.selectAll(".vlabels").size()) {
		svg.selectAll(".vlabels").remove();
	}
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
		CalcMemori(maxT, minT);
		function tW(d){ return x(d); }
		function tH(d){ return y(calcZahyou(d)); }
		
		var svg =d3.select("#"+id).select("."+type);

		
		//x and y axis maps.
		var x = d3.scaleLinear().domain([0, data.data_num - 1]).range([0, graph_width]);
		var y = d3.scaleLinear().domain([-1 * vline_lower * memori_line, vline_upper * memori_line]).range([graph_height, 0]);
		
		//draw yellow background for graph.
		svg.append("rect").attr("x",0).attr("y",0).attr("width",graph_width).attr("height",graph_height).style("fill","rgb(235,235,209)");
		
		// draw vertical lines of the grid.
		svg.selectAll(".vlines").data(d3.range(data.data_num)).enter().append("line").attr("class","vlines")
			.attr("x1",tW).attr("y1",0)
			.attr("x2", tW).attr("y2",function(d,i){ return  (Number(min_date_list[1]) + d) % 12 == 1 && (Number(min_date_list[1]) + d) % 12 != 1? graph_height+12: graph_height;});

		resetVlines(svg);
		//draw horizontal lines of the grid.
		svg.selectAll(".hlines").data(d3.range(vline_lower+vline_upper)).enter().append("line").attr("class","hlines")
			.attr("x1",function(d,i){ return calcZahyou(d)%memori_label == 0 && d!= vline_lower+vline_upper? -12: 0;})
			.attr("y1",tH).attr("x2", graph_width).attr("y2",tH);
		
		// make every 10th line in the grid darker.	
		svg.selectAll(".hlines").filter(function(d){ return calcZahyou(d)%memori_label == 0}).style("stroke-opacity",0.7);
		svg.selectAll(".vlines").filter(function(d){ return (Number(min_date_list[1]) + d) % 12 == 1}).style("stroke-opacity",0.7);
		
		svg.selectAll(".selectDate").data(d3.range(1)).enter().append("line").attr("class", "selectDate")
		.attr("y1",0).attr("y2", graph_height)
		.attr("x1",currentVline).attr("x2",currentVline)
		.attr("stroke", "red").attr("stroke-width", 1);

		function getHLabel(d,i){
			var r= dateMin +d*(1/12); 
			var year = Math.trunc(r);
			return year;
		}
		
		function getVLabel(d,i){
			return calcZahyou(d);
		}
		// add horizontal axis labels
		svg.append("g").attr("class","hlabels")
			.selectAll("text").data(d3.range(data.data_num).filter(function(d){ return (Number(min_date_list[1]) + d) % 12 == 1;})).enter().append("text")
			.text(getHLabel).attr("x",function(d,i){ return tW(d)+5;}).attr("y",graph_height+14);	
			
		// add vertical axes labels.
		svg.append("g").attr("class","vlabels")
			.selectAll("text").data(d3.range(vline_lower+vline_upper).filter(function(d){return calcZahyou(d)%memori_label == 0; })).enter().append("text")
			.attr("transform",function(d,i){ return "translate(-10,"+(tH(d)-14)+")rotate(-90)";})
			.text(getVLabel).attr("x",-10).attr("y",function(d){ return 5;});	

		svg.append("g").attr("class","htitle").selectAll("text").data(d3.range(1)).enter().append("text").attr("x", graph_width/2).attr("y", graph_height+30)
			.attr("font-size",15).text("年");

		svg.append("g").attr("class","vtitle").selectAll("text").data(d3.range(1)).enter().append("text").attr("x", -30).attr("y", 0)
			.attr("transform","translate(-30,"+ graph_height/2 +"),rotate(-90)").attr("font-size",15).text("店舗数");

		
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

	// add title.
	d3.select("#"+id).append("h3").text("全国の店舗数遷移");
	
	// add svg and set attributes for distribution.
	d3.select("#"+id).append("svg").attr("width",graph_width+2*graph_margin).attr("height",graph_height+2*graph_margin)
		.append("g").attr("transform","translate("+graph_margin+","+graph_margin+")").attr("class","dist");
		
	// Draw the a graph.
	draw("dist");			
        
}

function updateGraph(data, id) {
	pull_choice_data();
	var type = "dist";
    var ganre_list;

	var svg = d3.select("#"+id).select(".dist");
	
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
	for (var g in data[type]) {
		var M = d3.max(data[type][g]);
		maxT = M > maxT ? M : maxT;
		var m = d3.min(data[type][g]);
		minT = m < minT ? m : minT;
	}


	function transitionDefault(){
		CalcMemori(maxT, minT);
		function tW(d){ return x(d); }
		function tH(d){ return y(calcZahyou(d)); }

		var x = d3.scaleLinear().domain([0, data.data_num - 1]).range([0, graph_width]);
		var y = d3.scaleLinear().domain([-1 * vline_lower * memori_line, vline_upper * memori_line]).range([graph_height, 0]);


		// transition the lines, areas, and labels.
		var svg = d3.select("#"+id).select("."+type);
		resetVlines(svg);
		//draw horizontal lines of the grid.
		svg.selectAll(".hlines").data(d3.range(vline_lower+vline_upper)).enter().append("line").attr("class","hlines")
			.attr("x1",function(d,i){ return calcZahyou(d)%memori_label == 0 && d!= vline_lower+vline_upper? -12: 0;})
			.attr("y1",tH).attr("x2", graph_width).attr("y2",tH);
		
		// make every 10th line in the grid darker.	
		svg.selectAll(".hlines").filter(function(d){ return calcZahyou(d)%memori_label == 0}).style("stroke-opacity",0.7);	

		function getVLabel(d,i){
			return calcZahyou(d);
		}
		// add vertical axes labels.
		svg.append("g").attr("class","vlabels")
			.selectAll("text").data(d3.range(vline_lower+vline_upper).filter(function(d){return calcZahyou(d)%memori_label == 0; })).enter().append("text")
			.attr("transform",function(d,i){ return "translate(-10,"+(tH(d)-14)+")rotate(-90)";})
			.text(getVLabel).attr("x",-10).attr("y",function(d){ return 5;});	

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
		CalcMemori(maxCurrent, minCurrent);
		
		var x = d3.scaleLinear().domain([0, data.data_num - 1]).range([0, graph_width]);
		var y = d3.scaleLinear().domain([-1 * vline_lower * memori_line, vline_upper * memori_line]).range([graph_height, 0]);
		
		function tW(d){ return x(d); }
		function tH(d){ return y(calcZahyou(d)); }

		var svg = d3.select("#"+id).select("."+type);

		resetVlines(svg);
		//draw horizontal lines of the grid.
		svg.selectAll(".hlines").data(d3.range(vline_lower+vline_upper)).enter().append("line").attr("class","hlines")
			.attr("x1",function(d,i){ return calcZahyou(d)%memori_label == 0 && d!= vline_lower+vline_upper? -12: 0;})
			.attr("y1",tH).attr("x2", graph_width).attr("y2",tH);
		
		// make every 10th line in the grid darker.	
		svg.selectAll(".hlines").filter(function(d){ return calcZahyou(d)%memori_label == 0}).style("stroke-opacity",0.7);	

		function getVLabel(d,i){
			return calcZahyou(d);
		}
		// add vertical axes labels.
		svg.append("g").attr("class","vlabels")
			.selectAll("text").data(d3.range(vline_lower+vline_upper).filter(function(d){return calcZahyou(d)%memori_label == 0; })).enter().append("text")
			.attr("transform",function(d,i){ return "translate(-10,"+(tH(d)-14)+")rotate(-90)";})
			.text(getVLabel).attr("x",-10).attr("y",function(d){ return 5;});	


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
		
	}
	transitionClick();

}

function drawAll(data, id){
	var seg = d3.select("#"+id).selectAll("div").data(d3.range(data.length)).enter()
		.append("div").attr("id",function(d,i){ return "segment"+i;}).attr("class","shopdatadiv");
		
	d3.range(data.length).forEach(function(d,i){MakeGraph(data[i], "segment"+i );});
}

function updateGanre(data, id){
	d3.range(data.length).forEach(function(d,i){updateGraph(data[i], "segment"+i );});
}

function updateVline(input_data, id){
	var svg = d3.select("#"+id).select("."+"dist");	
	svg.selectAll(".selectDate").transition().duration(50)
		.attr("x1",currentVline).attr("x2",currentVline);
}
