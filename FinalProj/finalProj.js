const canvas = d3.select("#canvas");

const svg = canvas.append("svg")
    .attr('width', 600)
    .attr("height", 600);

const margin = { top: 30, right: 20, bottom: 70, left: 60 }; // Adjusted left margin for better labels
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg.append('g')
    .attr("width", graphWidth)
    .attr("height", graphHeight)
    .attr("transform", `translate(${margin.left},${margin.top})`);

const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

d3.json("titanic.json").then(data => {
    // Count passengers per category
    const sexCounts = d3.nest()
    .key(d => d.Sex)
    .rollup(v => v.length)
    .object(data);

    const dataset = [
        { Sex: "male", Count: sexCounts["male"] || 0 },
        { Sex: "female", Count: sexCounts["female"] || 0 }
    ];

    console.log(dataset);

    const y = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.Count)]) // Set domain based on count
        .range([graphHeight, 0]);

    const x = d3.scaleBand()
        .domain(dataset.map(d => d.Sex))
        .range([0, graphWidth])
        .padding(0.2);

    graph.selectAll("rect")
        .data(dataset)
        .enter().append("rect")
        .attr("width", x.bandwidth())
        .attr("fill", d => d.Sex === "male" ? "cyan" : "pink")
        .attr("x", d => x(d.Sex))
        .attr("height", d => graphHeight - y(d.Count)) // Corrected height
        .attr("y", d => y(d.Count)); // Corrected y positioning

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);
    // 📌 **ADDING TITLE**
    svg.append("text")
    .attr("x", graphWidth / 2 + margin.left)
    .attr("y", margin.top - 10)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text("Titanic Total Passenger Count by Gender");
});
