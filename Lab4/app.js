const canvas = d3.select("#canvas");

const svg = canvas.append("svg")
            .attr('width', 600)
            .attr("height", 600);

const margin = { top: 20, right: 20, bottom: 70, left: 40 }; // Increased left margin for y-axis labels
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg.append('g')
                .attr("width", graphWidth)
                .attr("height", graphHeight)
                .attr("transform", `translate(${margin.left},${margin.top})`);

const xAxisGroup = graph.append('g')
                        .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

d3.json("text.json").then(data => {
    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.height)])
                .range([graphHeight, 0]);  // Flipping range for correct bar orientation

    const x = d3.scaleBand()
                .domain(data.map(item => item.fill))
                .range([0, graphWidth])
                .paddingInner(0.05);

    graph.selectAll("rect")
        .data(data)
        .enter().append("rect")
        .attr("width", x.bandwidth()) // Added ()
        .attr("fill", d => d.fill)
        .attr("height", d => graphHeight - y(d.height))  // Fixed height calculation
        .attr("x", d => x(d.fill)) // Position bars along x-axis
        .attr("y", d => y(d.height)); // Position bars correctly from the top

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
});
