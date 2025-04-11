const canvas3 = d3.select("#canvas3");

const svg3 = canvas3.append("svg")
    .attr('width', 600)
    .attr("height", 600);

const margin3 = { top: 50, right: 20, bottom: 70, left: 100 };
const graphWidth3 = 600 - margin3.left - margin3.right;
const graphHeight3 = 600 - margin3.top - margin3.bottom;

const graph3 = svg3.append('g')
    .attr("width", graphWidth3)
    .attr("height", graphHeight3)
    .attr("transform", `translate(${margin3.left},${margin3.top})`);

const xAxisGroup3 = graph3.append('g')
    .attr('transform', `translate(0, ${graphHeight3})`);
const yAxisGroup3 = graph3.append('g');

// Fetch the data
d3.json("titanic.json").then(data => {
    // Group by class and calculate the number of survivors
    const classData = d3.nest()
        .key(d => d.Pclass)  // Group by class
        .rollup(group => group.filter(d => d.Survived === "1").length) // Count survivors
        .entries(data);
    
    // Sort classData by the 'key' (which is Pclass) in ascending order
    classData.sort((a, b) => a.key - b.key); // Assuming 'key' is numeric (1, 2, 3)



    // Create scales
    const x = d3.scaleBand()
        .domain(classData.map(d => d.key)) // Classes 1, 2, and 3
        .range([0, graphWidth3])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, d3.max(classData, d => d.value)])  // Max survivors in any class
        .nice()
        .range([graphHeight3, 0]);

    // Create bars
    graph3.selectAll(".bar")
        .data(classData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => graphHeight3 - y(d.value))
        .attr("fill", (d, i) => {
            if (d.key === "1") return "red"; // Class 1: red
            if (d.key === "2") return "green"; // Class 2: green
            return "blue"; // Class 3: cyan
        });

    // Add X Axis
    xAxisGroup3.call(d3.axisBottom(x));

    // Add Y Axis
    yAxisGroup3.call(d3.axisLeft(y));

    // Title for the chart
    svg3.append("text")
        .attr("x", graphWidth3 / 2 + margin3.left)
        .attr("y", margin3.top - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Survivors by Class");

    // Add labels on top of the bars
    graph3.selectAll(".label")
        .data(classData)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => x(d.key) + x.bandwidth() / 2)
        .attr("y", d => y(d.value) - 5) // Position above the bar
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .text(d => d.value);
        // Add X Axis Label
    svg3.append("text")
    .attr("x", graphWidth3 / 2 + margin3.left)
    .attr("y", graphHeight3 + margin3.top + 40) // Adjust this to move the label lower
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("Class");

    // Add Y Axis Label
    svg3.append("text")
    .attr("transform", "rotate(-90)")  // Rotate the text to make it vertical
    .attr("x", (graphWidth / 2 + margin.left)-610)  // Adjust to place it properly on the Y-axis
    .attr("y", graphHeight + margin.bottom - 550)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text("Number of Survivors");





    
});
