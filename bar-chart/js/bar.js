var url = "data/small.json";
//var url = "data/commit.json";
d3.json(url, makeChart);

//var x = d3.scale.linear().domain([0, d3.max(data)]).range([0, width]);
function makeChart(commitJSON) {
    var dataArray = [];
    var dataKeyVal = [];
    for (commit in commitJSON) {
        dataArray.push(commitJSON[commit]);
    }

    for (commit in commitJSON) {
        dataKeyVal.push({"date": commit, "amount": commitJSON[commit]});
    }

    dataArray.reverse();
    dataKeyVal.reverse();

    var margin = {top: 20, right: 30, bottom: 80, left: 40};
    var width = 900 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
    var barWidth  = width / dataKeyVal.length;


    var x = d3.scale.ordinal()
        .domain(dataKeyVal.map(function(d) { return d.date; } ))
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .domain([0, d3.max(dataKeyVal, function(d) { return d.amount })])
        .range([height, 0]);


    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate (" + margin.left + ", " + margin.top + ")");
   

    var bar = chart.selectAll("g")
        .data(dataKeyVal)
        .enter()
        .append("g")
        .attr("transform", function(d, i){return "translate(" + i * barWidth + ", 0)";});
       
    bar.append("rect")
        .attr("y", function(d) { return y(d.amount); })
        .attr("height", function(d) { return height - y(d.amount); })
        .attr("width", barWidth - 3); // 1 + 2: 1 is the gap, and 2 is the rect stroke width

    bar.append("text")
        .attr("x", barWidth / 2)
        .attr("y", function(d) { return y(d.amount) + 3; })
        .attr("dy", ".75em")
        .text(function(d) { return d.amount; });

    //Draw the label
    
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".71em")
            .attr("transform", function(d) {return "rotate(-65)"});

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");

}
