function distQuant(data, id){
    console.log("draw graph in distQuant");

    var choice_legend = {}
    for(var i = 0; i < data.genre_num; i++) {
        choice_legend[i] = false;
    }
    var true_num = 0;
    var legends = [];
    for(var i = 0; i < data.genre_num; i++) {
        legends.push(data.genre[i]);
    }

	function getPoints(_, i){		return _.map(function(d,j){ return {x:j, y:0};});	}
	/* function to return 0 for all attributes except k-th attribute.*/
    function getPointsZeroMulti(_, i) {return _.map(function(d,j){ return {x:j, y:(choice_legend[i] ? d[i] : 0 )};});	}
	function toComma(x) {    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
		
	var width=400, height=300, margin=20;
	var colors = ["#7D74FE","#7DFF26","#F84F1B","#28D8D5","#FB95B6","#9D9931","#F12ABF","#27EA88","#549AD5","#FEA526","#7B8D8B","#BB755F","#432E16",
"#D75CFB","#44E337","#51EBE3","#ED3D24","#4069AE","#E1CC72","#E33E88","#D8A3B3","#428B50","#66F3A3","#E28A2A","#B2594D","#609297","#E8F03F","#3D2241",
"#954EB3","#6A771C","#58AE2E","#75C5E9","#BBEB85","#A7DAB9","#6578E6","#932C5F","#865A26","#CC78B9","#2E5A52","#8C9D79","#9F6270","#6D3377","#551927","#DE8D5A",
"#E3DEA8","#C3C9DB","#3A5870","#CD3B4F","#E476E3","#DCAB94","#33386D","#4DA284","#817AA5","#8D8384","#624F49","#8E211F","#9E785B","#355C22","#D4ADDE",
"#A98229","#E88B87","#28282D","#253719","#BD89E1","#EB33D8","#6D311F","#DF45AA","#E86723","#6CE5BC","#765175","#942C42","#986CEB","#8CC488","#8395E3",
"#D96F98","#9E2F83","#CFCBB8","#4AB9B7","#E7AC2C","#E96D59","#929752","#5E54A9","#CCBA3F","#BD3CB8","#408A2C","#8AE32E","#5E5621","#ADD837","#BE3221","#8DA12E",
"#3BC58B","#6EE259","#52D170","#D2A867","#5C9CCD","#DB6472","#B9E8E0","#CDE067","#9C5615","#536C4F","#A74725","#CBD88A","#DF3066","#E9D235","#EE404C","#7DB362",
"#B1EDA3","#71D2E1","#A954DC","#91DF6E","#CB6429","#D64ADC"];

	var min_date_list = data.min_date.split("-");
	var max_date_list = data.max_date.split("-");
	dateMin = Number(min_date_list[0]) + 1/12*(Number(min_date_list[1])-1);
	dateMax = Number(max_date_list[0]) + 1/12*(Number(max_date_list[1])-1);
	
	function draw(type){
		var maxT = d3.max(data[type].map(function(d){ return d3.sum(d); }));
		var minT = d3.min(data[type].map(function(d){ return d3.sum(d); }));
		
		function tW(d){ return x(d); }
		function tH(d){ return y(minT + d*(maxT-minT)/50); }
		
		var svg =d3.select("#"+id).select("."+type);
		
		//x and y axis maps.
		var x = d3.scaleLinear().domain([0, data[type].length - 1]).range([0, width]);
		var y = d3.scaleLinear().domain([minT, maxT]).range([height, 0]);
		
		//draw yellow background for graph.
		svg.append("rect").attr("x",0).attr("y",0).attr("width",width).attr("height",height).style("fill","rgb(235,235,209)");
		
		// draw vertical lines of the grid.
		svg.selectAll(".vlines").data(d3.range(data.dist.length)).enter().append("line").attr("class","vlines")
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
				var day = Math.trunc((r - year)/(1/12));
				return year;
			}
		}
		
		function getVLabel(d,i){
			if(type=="dist"){ // for dist use the maximum for sum of frequencies and divide it into 5 pieces.
				return Math.round(maxT*i/5);
			}
		}
		// add horizontal axis labels
		svg.append("g").attr("class","hlabels")
			.selectAll("text").data(d3.range(data.dist.length).filter(function(d){ return (Number(min_date_list[1]) + d) % 12 == 1;})).enter().append("text")
			.text(getHLabel).attr("x",function(d,i){ return tW(d)+5;}).attr("y",height+14);	
			
		// add vertical axes labels.
		svg.append("g").attr("class","vlabels")
			.selectAll("text").data(d3.range(41).filter(function(d){ return d%10==0 })).enter().append("text")
			.attr("transform",function(d,i){ return "translate(-10,"+(tH(d)-14)+")rotate(-90)";})
			.text(getVLabel).attr("x",-10).attr("y",function(d){ return 5;});	
		
		var graph_line = d3.line().x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); });

		dataset = data.genre.map(function(d,i){ return getPoints(data[type], i);});

		svg.selectAll("path").data(dataset).enter()
			.append("path").attr("d", graph_line)
			.attr("stroke-width", function(d,i) {
				if (choice_legend[i]) {
					return 2;
				}
				return 0;})
			.attr("stroke", function(d,i) {return colors[i]; }).attr("fill", "none");

			
	}
	
	function transitionDefault(type){
		var maxT = d3.max(data[type].map(function(d){ return d3.sum(d); }));
		var minT = d3.min(data[type].map(function(d){ return d3.sum(d); }));
		
		function tW(d){ return x(d); }
		function tH(d){ return y(minT + d*(maxT-minT)/50); }

		var x = d3.scaleLinear().domain([0, data[type].length - 1]).range([0, width]);
		var y = d3.scaleLinear().domain([minT, maxT]).range([height, 0]);


		// transition the lines, areas, and labels.
		var svg = d3.select("#"+id).select("."+type);	

		var graph_line = d3.line().x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); });

		dataset = data.genre.map(function(d,i){ return getPoints(data[type], i);});


		svg.selectAll("path")
			.data(dataset)
			.transition().duration(500)
			.attr("d", graph_line)
			.attr("stroke-width", function(d,i) {
				if (choice_legend[i]) {
					return 2;
				}
				return 0;
			});// .attr("fill", "none");

		svg.selectAll(".vlines").transition().duration(500).attr("x1",tW).attr("x2", tW);			
		svg.selectAll(".hlines").transition().duration(500).attr("y1",tH).attr("y2",tH);			
		svg.selectAll(".vlabels").selectAll("text").transition().duration(500)
			.attr("transform",function(d,i){ return "translate(-10,"+(tH(d)-14)+")rotate(-90)";});	
			
	}


    function transitionClick(type){
        if (true_num == 0) {
            transitionDefault("dist");
            return;
        }
		var maxT = d3.max(data[type].map(function(d){ return d3.sum(d); }));
		var minT = d3.min(data[type].map(function(d){ return d3.sum(d); }));
		var max  = d3.max(data[type].map(function(d){ 
            var max_choice = 0;
            for (var i = 0; i < data.genre_num; i++) {
                if (choice_legend[i]) {
                    max_choice = max_choice < d[i] ? d[i] : max_choice;
                }
            }
            return max_choice; 
        }));

		var min  = d3.min(data[type].map(function(d){ 
            var min_choice = 0;
            for (var i = 0; i < data.genre_num; i++) {
                if (choice_legend[i]) {
                    min_choice = min_choice > d[i] ? d[i] : min_choice;;
                }
            }
            return min_choice; 
        }));
		
		var x = d3.scaleLinear().domain([0, data[type].length - 1]).range([0, width]);
		var y = d3.scaleLinear().domain([min, max]).range([height, 0]);
		
		function tW(d){ return x(d); }
		function tH(d){ return y(minT + d*(maxT-minT)/50); }

		var svg = d3.select("#"+id).select("."+type);
		//transition all the lines, labels, and areas.
		var graph_line = d3.line().x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); });

		dataset = data.genre.map(function(d,i){ return getPointsZeroMulti(data[type], i);});


		svg.selectAll("path")
			.data(dataset)
			.transition().duration(500)
			.attr("d", graph_line).attr("fill", "none")
			.attr("stroke-width", function(d,i) {
				if (choice_legend[i]) {
					return 2;
				}
				return 0;
			});

			
		svg.selectAll(".vlines").transition().duration(500).attr("x1",tW).attr("x2", tW);			
		svg.selectAll(".hlines").transition().duration(500).attr("y1",tH).attr("y2",tH);						
		svg.selectAll(".vlabels").selectAll("text").transition().duration(500)
			.attr("transform",function(d,i){ return "translate(-10,"+(tH(d)-14)+")rotate(-90)";});	
		
	}

	// add title.
	d3.select("#"+id).append("h3").text(data.title);
	
	// add svg and set attributes for distribution.
	d3.select("#"+id).append("svg").attr("width",width+2*margin).attr("height",height+2*margin)
		.append("g").attr("transform","translate("+margin+","+margin+")").attr("class","dist");
		
	// Draw the a graph.
	draw("dist");			
		
	// draw legends.
	var legRow = d3.select("#"+id).append("div").attr("class","legend")
		.append("table").selectAll("tr").data(data.genre).enter().append("tr").append("td");
	legRow.append("div").style("background",function(d,i){ return colors[i];})
		.on("click", function(event, d) {
			var index = legends.indexOf(d);
            if (choice_legend[index]) {
                choice_legend[index] = false;
                true_num--;
            }
            else {
                choice_legend[index] = true;
                true_num++;
            }
            legRow.style("background-color", function(d) {
				var index = legends.indexOf(d);
                if (choice_legend[index]) {
                    return "skyblue";
                }
                return "white";
            });	
			transitionClick("dist");
        });
		
	legRow.append("span").text(function(d){ return d;})
		.on("click", function(event, d) {
			var index = legends.indexOf(d);
            if (choice_legend[index]) {
                choice_legend[index] = false;
                true_num--;
            }
            else {
                choice_legend[index] = true;
                true_num++;
            }
            legRow.style("background-color", function(d) {
				var index = legends.indexOf(d);
                if (choice_legend[index]) {
                    return "skyblue";
                }
                return "white";
            });	
			transitionClick("dist");
        });
}

function drawAll(data, id){

	var seg = d3.select("#"+id).selectAll("div").data(d3.range(data.length)).enter()
		.append("div").attr("id",function(d,i){ return "segment"+i;}).attr("class","shopdatadiv");
		
	d3.range(data.length).forEach(function(d,i){distQuant(data[i], "segment"+i );});
}
function distQuant(data, id){

    var choice_legend = {}
    for(var i = 0; i < data.genre_num; i++) {
        choice_legend[i] = false;
    }
    var true_num = 0;
    var legends = [];
    for(var i = 0; i < data.genre_num; i++) {
        legends.push(data.genre[i]);
    }

	function getPoints(_, i){		return _.map(function(d,j){ return {x:j, y:0};});	}
	/* function to return 0 for all attributes except k-th attribute.*/
    function getPointsZeroMulti(_, i) {return _.map(function(d,j){ return {x:j, y:(choice_legend[i] ? d[i] : 0 )};});	}
	function toComma(x) {    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
		
	var width=400, height=300, margin=20;
	var colors = ["#7D74FE","#7DFF26","#F84F1B","#28D8D5","#FB95B6","#9D9931","#F12ABF","#27EA88","#549AD5","#FEA526","#7B8D8B","#BB755F","#432E16",
"#D75CFB","#44E337","#51EBE3","#ED3D24","#4069AE","#E1CC72","#E33E88","#D8A3B3","#428B50","#66F3A3","#E28A2A","#B2594D","#609297","#E8F03F","#3D2241",
"#954EB3","#6A771C","#58AE2E","#75C5E9","#BBEB85","#A7DAB9","#6578E6","#932C5F","#865A26","#CC78B9","#2E5A52","#8C9D79","#9F6270","#6D3377","#551927","#DE8D5A",
"#E3DEA8","#C3C9DB","#3A5870","#CD3B4F","#E476E3","#DCAB94","#33386D","#4DA284","#817AA5","#8D8384","#624F49","#8E211F","#9E785B","#355C22","#D4ADDE",
"#A98229","#E88B87","#28282D","#253719","#BD89E1","#EB33D8","#6D311F","#DF45AA","#E86723","#6CE5BC","#765175","#942C42","#986CEB","#8CC488","#8395E3",
"#D96F98","#9E2F83","#CFCBB8","#4AB9B7","#E7AC2C","#E96D59","#929752","#5E54A9","#CCBA3F","#BD3CB8","#408A2C","#8AE32E","#5E5621","#ADD837","#BE3221","#8DA12E",
"#3BC58B","#6EE259","#52D170","#D2A867","#5C9CCD","#DB6472","#B9E8E0","#CDE067","#9C5615","#536C4F","#A74725","#CBD88A","#DF3066","#E9D235","#EE404C","#7DB362",
"#B1EDA3","#71D2E1","#A954DC","#91DF6E","#CB6429","#D64ADC"];

	var min_date_list = data.min_date.split("-");
	var max_date_list = data.max_date.split("-");
	dateMin = Number(min_date_list[0]) + 1/12*(Number(min_date_list[1])-1);
	dateMax = Number(max_date_list[0]) + 1/12*(Number(max_date_list[1])-1);
	
	function draw(type){
		var maxT = d3.max(data[type].map(function(d){ return d3.sum(d); }));
		var minT = d3.min(data[type].map(function(d){ return d3.sum(d); }));
		
		function tW(d){ return x(d); }
		function tH(d){ return y(minT + d*(maxT-minT)/50); }
		
		var svg =d3.select("#"+id).select("."+type);
		
		//x and y axis maps.
		var x = d3.scaleLinear().domain([0, data[type].length - 1]).range([0, width]);
		var y = d3.scaleLinear().domain([minT, maxT]).range([height, 0]);
		
		//draw yellow background for graph.
		svg.append("rect").attr("x",0).attr("y",0).attr("width",width).attr("height",height).style("fill","rgb(235,235,209)");
		
		// draw vertical lines of the grid.
		svg.selectAll(".vlines").data(d3.range(data.dist.length)).enter().append("line").attr("class","vlines")
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
				var day = Math.trunc((r - year)/(1/12));
				return year;
			}
		}
		
		function getVLabel(d,i){
			if(type=="dist"){ // for dist use the maximum for sum of frequencies and divide it into 5 pieces.
				return Math.round(maxT*i/5);
			}
		}
		// add horizontal axis labels
		svg.append("g").attr("class","hlabels")
			.selectAll("text").data(d3.range(data.dist.length).filter(function(d){ return (Number(min_date_list[1]) + d) % 12 == 1;})).enter().append("text")
			.text(getHLabel).attr("x",function(d,i){ return tW(d)+5;}).attr("y",height+14);	
			
		// add vertical axes labels.
		svg.append("g").attr("class","vlabels")
			.selectAll("text").data(d3.range(41).filter(function(d){ return d%10==0 })).enter().append("text")
			.attr("transform",function(d,i){ return "translate(-10,"+(tH(d)-14)+")rotate(-90)";})
			.text(getVLabel).attr("x",-10).attr("y",function(d){ return 5;});	
		
		var graph_line = d3.line().x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); });

		dataset = data.genre.map(function(d,i){ return getPoints(data[type], i);});

		svg.selectAll("path").data(dataset).enter()
			.append("path").attr("d", graph_line)
			.attr("stroke-width", function(d,i) {
				if (choice_legend[i]) {
					return 2;
				}
				return 0;})
			.attr("stroke", function(d,i) {return colors[i]; }).attr("fill", "none");

			
	}
	
	function transitionDefault(type){
		var maxT = d3.max(data[type].map(function(d){ return d3.sum(d); }));
		var minT = d3.min(data[type].map(function(d){ return d3.sum(d); }));
		
		function tW(d){ return x(d); }
		function tH(d){ return y(minT + d*(maxT-minT)/50); }

		var x = d3.scaleLinear().domain([0, data[type].length - 1]).range([0, width]);
		var y = d3.scaleLinear().domain([minT, maxT]).range([height, 0]);


		// transition the lines, areas, and labels.
		var svg = d3.select("#"+id).select("."+type);	

		var graph_line = d3.line().x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); });

		dataset = data.genre.map(function(d,i){ return getPoints(data[type], i);});


		svg.selectAll("path")
			.data(dataset)
			.transition().duration(500)
			.attr("d", graph_line)
			.attr("stroke-width", function(d,i) {
				if (choice_legend[i]) {
					return 2;
				}
				return 0;
			});// .attr("fill", "none");

		svg.selectAll(".vlines").transition().duration(500).attr("x1",tW).attr("x2", tW);			
		svg.selectAll(".hlines").transition().duration(500).attr("y1",tH).attr("y2",tH);			
		svg.selectAll(".vlabels").selectAll("text").transition().duration(500)
			.attr("transform",function(d,i){ return "translate(-10,"+(tH(d)-14)+")rotate(-90)";});	
			
	}


    function transitionClick(type){
        if (true_num == 0) {
            transitionDefault("dist");
            return;
        }
		var maxT = d3.max(data[type].map(function(d){ return d3.sum(d); }));
		var minT = d3.min(data[type].map(function(d){ return d3.sum(d); }));
		var max  = d3.max(data[type].map(function(d){ 
            var max_choice = 0;
            for (var i = 0; i < data.genre_num; i++) {
                if (choice_legend[i]) {
                    max_choice = max_choice < d[i] ? d[i] : max_choice;
                }
            }
            return max_choice; 
        }));

		var min  = d3.min(data[type].map(function(d){ 
            var min_choice = 0;
            for (var i = 0; i < data.genre_num; i++) {
                if (choice_legend[i]) {
                    min_choice = min_choice > d[i] ? d[i] : min_choice;;
                }
            }
            return min_choice; 
        }));
		
		var x = d3.scaleLinear().domain([0, data[type].length - 1]).range([0, width]);
		var y = d3.scaleLinear().domain([min, max]).range([height, 0]);
		
		function tW(d){ return x(d); }
		function tH(d){ return y(minT + d*(maxT-minT)/50); }

		var svg = d3.select("#"+id).select("."+type);
		//transition all the lines, labels, and areas.
		var graph_line = d3.line().x(function(d) { return x(d.x); })
			.y(function(d) { return y(d.y); });

		dataset = data.genre.map(function(d,i){ return getPointsZeroMulti(data[type], i);});


		svg.selectAll("path")
			.data(dataset)
			.transition().duration(500)
			.attr("d", graph_line).attr("fill", "none")
			.attr("stroke-width", function(d,i) {
				if (choice_legend[i]) {
					return 2;
				}
				return 0;
			});

			
		svg.selectAll(".vlines").transition().duration(500).attr("x1",tW).attr("x2", tW);			
		svg.selectAll(".hlines").transition().duration(500).attr("y1",tH).attr("y2",tH);						
		svg.selectAll(".vlabels").selectAll("text").transition().duration(500)
			.attr("transform",function(d,i){ return "translate(-10,"+(tH(d)-14)+")rotate(-90)";});	
		
	}

	// add title.
	d3.select("#"+id).append("h3").text(data.title);
	
	// add svg and set attributes for distribution.
	d3.select("#"+id).append("svg").attr("width",width+2*margin).attr("height",height+2*margin)
		.append("g").attr("transform","translate("+margin+","+margin+")").attr("class","dist");
		
	// Draw the a graph.
	draw("dist");			
		
	// draw legends.
	var legRow = d3.select("#"+id).append("div").attr("class","legend")
		.append("table").selectAll("tr").data(data.genre).enter().append("tr").append("td");
	legRow.append("div").style("background",function(d,i){ return colors[i];})
		.on("click", function(event, d) {
			var index = legends.indexOf(d);
            if (choice_legend[index]) {
                choice_legend[index] = false;
                true_num--;
            }
            else {
                choice_legend[index] = true;
                true_num++;
            }
            legRow.style("background-color", function(d) {
				var index = legends.indexOf(d);
                if (choice_legend[index]) {
                    return "skyblue";
                }
                return "white";
            });	
			transitionClick("dist");
        });
		
	legRow.append("span").text(function(d){ return d;})
		.on("click", function(event, d) {
			var index = legends.indexOf(d);
            if (choice_legend[index]) {
                choice_legend[index] = false;
                true_num--;
            }
            else {
                choice_legend[index] = true;
                true_num++;
            }
            legRow.style("background-color", function(d) {
				var index = legends.indexOf(d);
                if (choice_legend[index]) {
                    return "skyblue";
                }
                return "white";
            });	
			transitionClick("dist");
        });
}

function drawAll(data, id){
    import("./d3.js").then(module => {
        var seg = d3.select("#"+id).selectAll("div").data(d3.range(data.length)).enter()
            .append("div").attr("id",function(d,i){ return "segment"+i;}).attr("class","shopdatadiv");
            
        d3.range(data.length).forEach(function(d,i){distQuant(data[i], "segment"+i );});
    });
}
