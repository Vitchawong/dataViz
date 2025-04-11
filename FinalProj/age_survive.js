const canvas5 = d3.select("#canvas5");

const svg5 = canvas5.append("svg")
    .attr('width', 600)
    .attr("height", 600);

const margin5 = { top: 30, right: 20, bottom: 70, left: 60 };
const graphWidth5 = 600 - margin5.left - margin5.right;
const graphHeight5 = 600 - margin5.top - margin5.bottom;

const graph5 = svg5.append('g')
    .attr("width", graphWidth5)
    .attr("height", graphHeight5)
    .attr("transform", `translate(${margin5.left},${margin5.top})`);

const xAxisGroup5 = graph5.append('g')
    .attr('transform', `translate(0, ${graphHeight5})`);
const yAxisGroup5 = graph5.append('g');

// Fetch the data
d3.json("titanic.json").then(data => {
    // Filter out undefined or null ages
    const ages5 = data.map(d => d.Age).filter(age => age != null);

    // Create bins for the histogram (age ranges)
    const ageBins5 = d3.histogram()
        .domain([0, 80])  // Age range from 0 to 80
        .thresholds(d3.range(0, 81, 5))(ages5);  // Bin size of 5 years (0-5, 5-10, ..., 75-80)

    // Create scales
    const x5 = d3.scaleBand()
        .domain(ageBins5.map(d => `${d.x0}-${d.x1}`))  // Label bins with age ranges
        .range([0, graphWidth5])
        .padding(0.1);

    const y5 = d3.scaleLinear()
        .domain([0, d3.max(ageBins5, d => d.length)])  // Max count of passengers in any bin
        .nice()
        .range([graphHeight5, 0]);

    // Create bars
    graph5.selectAll(".bar")
        .data(ageBins5)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x5(`${d.x0}-${d.x1}`))
        .attr("y", d => y5(d.length))
        .attr("width", x5.bandwidth())
        .attr("height", d => graphHeight5 - y5(d.length))
        .attr("fill", "#00ced1");

    // Add X Axis
    xAxisGroup5.call(d3.axisBottom(x5));

    // Add Y Axis
    yAxisGroup5.call(d3.axisLeft(y5));

    // Title for the chart
    svg5.append("text")
        .attr("x", graphWidth5 / 2 + margin5.left)
        .attr("y", margin5.top - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Age Distribution of Titanic Passengers");


    svg5.append("text")
    .attr("x", graphWidth3 / 2 + margin3.left)
    .attr("y", graphHeight3 + margin3.top + 40) // Adjust this to move the label lower
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("Age Group");

    // Add Y Axis Label
    svg5.append("text")
    .attr("transform", "rotate(-90)")  // Rotate the text to make it vertical
    .attr("x", (graphWidth / 2 + margin.left)-610)  // Adjust to place it properly on the Y-axis
    .attr("y", graphHeight + margin.bottom - 550)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("Number of Passengers");
});
