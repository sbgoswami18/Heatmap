// script.js
document.addEventListener('DOMContentLoaded', function () {
    const data = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
    ];

    const margin = { top: 30, right: 30, bottom: 30, left: 30 },
        width = 300 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    const svg = d3.select("#heatmap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleBand()
        .range([0, width])
        .domain(data[0].map((_, i) => i))
        .padding(0.05);

    const y = d3.scaleBand()
        .range([0, height])
        .domain(data.map((_, i) => i))
        .padding(0.05);

    const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([1, 9]);

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

    svg.selectAll()
        .data(data.flat())
        .enter()
        .append("rect")
        .attr("x", (d, i) => x(i % 3))
        .attr("y", (d, i) => y(Math.floor(i / 3)))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", d => colorScale(d))
        .on("mouseover", function (event, d) {
            d3.select(this)
                .style("fill", d3.interpolateReds(d / 9));

            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html("Value: " + d)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mousemove", function (event) {
            tooltip.style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function (event, d) {
            d3.select(this)
                .style("fill", colorScale(d));

            tooltip.transition().duration(200).style("opacity", 0);
        });

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).tickFormat((d, i) => i + 1));

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat((d, i) => i + 1));
});
