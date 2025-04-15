// const canvas = d3.select("#canvas");

// const svg = canvas.append("svg")
//     .attr('width', 600)
//     .attr("height", 600);

// const margin = { top: 30, right: 20, bottom: 70, left: 60 }; // Adjusted left margin for better labels
// const graphWidth = 600 - margin.left - margin.right;
// const graphHeight = 600 - margin.top - margin.bottom;

// const graph = svg.append('g')
//     .attr("width", graphWidth)
//     .attr("height", graphHeight)
//     .attr("transform", `translate(${margin.left},${margin.top})`);

// const xAxisGroup = graph.append('g')
//     .attr('transform', `translate(0, ${graphHeight})`);
// const yAxisGroup = graph.append('g');

// d3.json("titanic.json").then(data => {
//     // Count passengers per category
//     const sexCounts = d3.nest()
//     .key(d => d.Sex)
//     .rollup(v => v.length)
//     .object(data);

//     const dataset = [
//         { Sex: "male", Count: sexCounts["male"] || 0 },
//         { Sex: "female", Count: sexCounts["female"] || 0 }
//     ];

//     console.log(dataset);

//     const y = d3.scaleLinear()
//         .domain([0, d3.max(dataset, d => d.Count)]) // Set domain based on count
//         .range([graphHeight, 0]);

//     const x = d3.scaleBand()
//         .domain(dataset.map(d => d.Sex))
//         .range([0, graphWidth])
//         .padding(0.2);

//     // 📌 **Appending Bars for the Data**
//     const bars = graph.selectAll("rect")
//         .data(dataset)
//         .enter().append("rect")
//         .attr("width", x.bandwidth())
//         .attr("fill", d => d.Sex === "male" ? "cyan" : "pink")
//         .attr("x", d => x(d.Sex))
//         .attr("height", d => graphHeight - y(d.Count)) // Corrected height
//         .attr("y", d => y(d.Count)); // Corrected y positioning

//     // 📌 **Adding Count Text Above Each Bar**
//     bars.each(function(d) {
//         graph.append("text")
//             .attr("x", x(d.Sex) + x.bandwidth() / 2) // Positioning text in the center of the bar
//             .attr("y", y(d.Count) - 5) // Position the text just above the top of the bar
//             .attr("text-anchor", "middle")
//             .attr("font-size", "12px")
//             .attr("fill", "black")
//             .text(d.Count); // Display the count value
//     });

//     const xAxis = d3.axisBottom(x);
//     const yAxis = d3.axisLeft(y);

//     xAxisGroup.call(xAxis);
//     yAxisGroup.call(yAxis);

//     // 📌 **ADDING TITLE**
//     svg.append("text")
//     .attr("x", graphWidth / 2 + margin.left)
//     .attr("y", margin.top - 10)
//     .attr("text-anchor", "middle")
//     .style("font-size", "18px")
//     .style("font-weight", "bold")
//     .text("Titanic Total Passenger Count by Gender");

//     // Add Y Axis Label
//     svg.append("text")
//     .attr("transform", "rotate(-90)")  // Rotate the text to make it vertical
//     .attr("x", (graphWidth / 2 + margin.left)-610)  // Adjust to place it properly on the Y-axis
//     .attr("y", graphHeight + margin.bottom - 550)  // Adjust this to move the label lower
//     .attr("text-anchor", "middle")
//     .style("font-size", "14px")
//     .style("font-weight", "bold")

//     .text("Number of Passengers");

//     // Add X Axis Label
//     svg.append("text")
//     .attr("x", graphWidth / 2 + margin.left)  // Center the text horizontally
//     .attr("y", graphHeight + margin.bottom - 10) // Position it just below the X-axis
//     .attr("text-anchor", "middle")
//     .style("font-size", "14px")
//     .style("font-weight", "bold")

//     .text("Gender");  // Label for X-axis
// });
const canvas = d3.select("#canvas");

const svg = canvas.append("svg")
    .attr('width', 800)
    .attr("height", 800);

const margin = { top: 30, right: 20, bottom: 70, left: 60 };
const graphWidth = 800 - margin.left - margin.right;
const graphHeight = 800 - margin.top - margin.bottom;

const graph = svg.append('g')
    .attr("width", graphWidth)
    .attr("height", graphHeight)
    .attr("transform", `translate(${margin.left},${margin.top+10})`);

const xAxisGroup = graph.append('g')
    .attr('transform', `translate(0, ${graphHeight})`);
const yAxisGroup = graph.append('g');

// Fetch the data
d3.json("titanic.json").then(data => {
    const embarkationMap = {
        C: "Cherbourg",
        Q: "Queenstown",
        S: "Southampton",
        Unknown: "Unknown"
    };
    
    // Group and convert codes to full names
    const embarkationCounts = d3.nest()
        .key(d => embarkationMap[d.Embarked] || "Unknown")
        .rollup(v => v.length)
        .entries(data);
    // Create the scales
    const x = d3.scaleBand()
        .domain(embarkationCounts.map(d => d.key))  // C, Q, S, or Unknown
        .range([0, graphWidth])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(embarkationCounts, d => d.value)])  // Max number of passengers
        .range([graphHeight, 0]);

    // Create bars for the data
    const bars = graph.selectAll("rect")
        .data(embarkationCounts)
        .enter().append("rect")
        .attr("width", x.bandwidth())
        .attr("fill", "steelblue")
        .attr("x", d => x(d.key))
        .attr("height", d => graphHeight - y(d.value)) // Bar height
        .attr("y", d => y(d.value)); // Bar position on the y-axis

    // Add count text above the bars
    bars.each(function(d) {
        graph.append("text")
            .attr("x", x(d.key) + x.bandwidth() / 2) // Position the text in the center of the bar
            .attr("y", y(d.value) - 5) // Position the text just above the bar
            .attr("text-anchor", "middle")
            .attr("font-size", "20px")
            .attr("fill", "black")
            .text(d.value); // Display the count value
    });

    // Add X Axis
    const xAxis = d3.axisBottom(x);
    xAxisGroup.call(xAxis);
    xAxisGroup.selectAll("text")
    .style("font-size", "16px");

    // Add Y Axis
    const yAxis = d3.axisLeft(y);
    yAxisGroup.call(yAxis);
    yAxisGroup.selectAll("text")
    .style("font-size", "16px");

    // Add Title for the chart
    svg.append("text")
        .attr("x", graphWidth / 2 + margin.left)
        .attr("y", margin.top - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Passenger Distribution by Embarkation Location");

    // Add Y Axis Label
    svg.append("text")
        .attr("transform", "rotate(-90)")  // Rotate the text to make it vertical
        .attr("x", -graphHeight / 2 - margin.top) // Adjust to place it properly on the Y-axis
        .attr("y", -40)  // Adjust this to move the label lower
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .style("fill", "blue")  // Set the font color to blue
        .text("Number of Passengers");

    // Add X Axis Label
    svg.append("text")
        .attr("x", graphWidth / 2 + margin.left)
        .attr("y", graphHeight + margin.bottom +10)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Embarkation Location");


            // Y-axis label
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -graphHeight5 / 2)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Number of Passengers");
});
