const canvas3 = d3.select("#canvas3");

const svg3 = canvas3.append("svg")
    .attr('width', 900)
    .attr("height", 800);

const margin3 = { top: 50, right: 20, bottom: 70, left: 100 };
const graphWidth3 = 800 - margin3.left - margin3.right;
const graphHeight3 = 800 - margin3.top - margin3.bottom;

const graph3 = svg3.append('g')
    .attr("width", graphWidth3)
    .attr("height", graphHeight3)
    .attr("transform", `translate(${margin3.left},${margin3.top})`);

const xAxisGroup3 = graph3.append('g')
    .attr('transform', `translate(0, ${graphHeight3})`);
const yAxisGroup3 = graph3.append('g');

// Fetch the data
d3.json("titanic.json").then(data => {
    // Class name map
    const classLabels = {
        "1": "First Class",
        "2": "Second Class",
        "3": "Third Class"
    };

    // Group and count survivors and non-survivors by class
    const classData = d3.nest()
        .key(d => d.Pclass)
        .rollup(group => ({
            survived: group.filter(d => d.Survived === "1").length,
            notSurvived: group.filter(d => d.Survived === "0").length
        }))
        .entries(data)
        .map(d => ({
            class: classLabels[d.key],
            survived: d.value.survived,
            notSurvived: d.value.notSurvived
        }));

    // Stack generator - switched order
    const stack = d3.stack()
        .keys(["survived", "notSurvived"]);  // Changed order here

    const stackedData = stack(classData);

    // Scales
    const x = d3.scaleBand()
        .domain(classData.map(d => d.class))
        .range([0, graphWidth3])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(classData, d => d.survived + d.notSurvived)])
        .nice()
        .range([graphHeight3, 0]);

    // Color scale - adjusted to match new order
    const color = d3.scaleOrdinal()
        .domain(["survived", "notSurvived"])  // Changed order here
        .range(["cyan", "pink"]);  // Changed order here

    // Draw bars
    const bars = graph3.selectAll("g.layer")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", d => color(d.key));

    bars.selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => x(d.data.class))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());

    // Add percentage labels
    bars.selectAll("text.percentage")
        .data(d => d)
        .enter()
        .append("text")
        .attr("class", "percentage")
        .attr("x", d => x(d.data.class) + x.bandwidth() / 2)
        .attr("y", d => (y(d[1]) + y(d[0])) / 2) // Center of the segment
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("fill", "black")
        .text(d => {
            const total = d.data.survived + d.data.notSurvived;
            const value = d[1] - d[0];
            const percentage = (value / total * 100).toFixed(1);
            return percentage + "%";
        });
    // Add axes
    xAxisGroup3.call(d3.axisBottom(x));
    xAxisGroup3.selectAll("text")
    .style("font-size", "16px");
    yAxisGroup3.call(d3.axisLeft(y));
    yAxisGroup3.selectAll("text")
    .style("font-size", "16px");

    // Chart title
    svg3.append("text")
        .attr("x", graphWidth3 / 2 + margin3.left)
        .attr("y", margin3.top - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Survival by Class (Stacked)");

    // X Axis Label
    svg3.append("text")
        .attr("x", graphWidth3 / 2 + margin3.left)
        .attr("y", graphHeight3 + margin3.top + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Passenger Classes");

    // Y Axis Label
    svg3.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -graphHeight3 / 2 - margin3.top)
        .attr("y", margin3.left - 70)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Number of Passengers");

    // Add legend - updated order
    const legend = svg3.append("g")
        .attr("transform", `translate(${graphWidth3 + margin3.left - 120}, ${margin3.top})`);

    const categories = ["Survived Passengers", "Not Survived"];  // Keep this order to match the stack
    categories.forEach((label, i) => {
        const colorKey = label.toLowerCase().replace(" ", "");
        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 20)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(colorKey));

        legend.append("text")
            .attr("x", 20)
            .attr("y", i * 20 + 12)
            .style("font-size", "20px")
            .text(label);
    });
});