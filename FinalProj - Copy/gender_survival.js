const canvas2 = d3.select("#canvas2");

const svg2 = canvas2.append("svg")
    .attr('width', 800)
    .attr("height", 800);

const margin2 = { top: 50, right: 20, bottom: 70, left: 60 };
const graphWidth2 = 800 - margin2.left - margin2.right;
const graphHeight2 = 800 - margin2.top - margin2.bottom;

const graph2 = svg2.append('g')
    .attr("width", graphWidth2)
    .attr("height", graphHeight2)
    .attr("transform", `translate(${margin2.left+10},${margin2.top})`);

const xAxisGroup2 = graph2.append('g')
    .attr('transform', `translate(0, ${graphHeight2})`);
const yAxisGroup2 = graph2.append('g');

d3.json("titanic.json").then(data => {
    let male_survive = 0, female_survive = 0;
    let male_total = 0, female_total = 0;

    data.forEach(d => {
        if (d.Sex === "male") {
            male_total += 1;
            if (d.Survived === "1") male_survive += 1;
        } else if (d.Sex === "female") {
            female_total += 1;
            if (d.Survived === "1") female_survive += 1;
        }
    });

    const chartData = [
        {
            gender: "Male",
            Survived: male_survive,
            "Did Not Survive": male_total - male_survive
        },
        {
            gender: "Female",
            Survived: female_survive,
            "Did Not Survive": female_total - female_survive
        }
    ];

    const subgroups = ["Survived", "Did Not Survive"];
    const groups = chartData.map(d => d.gender);

    const x = d3.scaleBand()
        .domain(groups)
        .range([0, graphWidth2])
        .padding(0.4);

    const y = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.Survived + d["Did Not Survive"])])
        .range([graphHeight2, 0]);

    const color = d3.scaleOrdinal()
        .domain(subgroups)
        .range(["#00ced1", "pink"]);

    // Stack the data
    const stackedData = d3.stack()
        .keys(subgroups)(chartData);

    // Draw stacked bars
    graph2.selectAll("g.layer")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "layer")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", d => x(d.data.gender))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());

    // Add percentage labels inside each bar segment
    graph2.selectAll("g.layer")
        .data(stackedData)
        .selectAll("text")
        .data(d => d)
        .enter()
        .append("text")
        .attr("x", d => x(d.data.gender) + x.bandwidth() / 2)
        .attr("y", d => y((d[0] + d[1]) / 2))
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .style("fill", "black")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text(d => {
            const total = d.data.Survived + d.data["Did Not Survive"];
            const count = d[1] - d[0];
            const percent = Math.round((count / total) * 100);
            return percent + "%";
        });

    // Add axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    xAxisGroup2.call(xAxis);
    xAxisGroup2.selectAll("text")
    .style("font-size", "16px");
    yAxisGroup2.call(yAxis);
    yAxisGroup2.selectAll("text")
    .style("font-size", "16px");

    // Add title
    svg2.append("text")
        .attr("x", graphWidth2 / 2 + margin2.left)
        .attr("y", margin2.top - 15)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Titanic Survivors vs Non-Survivors by Gender");

    // Add legend
    const legend = svg2.append("g")
        .attr("transform", `translate(${graphWidth2 - 100}, ${margin2.top})`);

    legend.selectAll("rect")
        .data(color.domain())
        .enter()
        .append("rect")
        .attr("y", (d, i) => i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", d => color(d));

    legend.selectAll("text")
        .data(color.domain())
        .enter()
        .append("text")
        .attr("x", 20)
        .attr("y", (d, i) => i * 20 + 12)
        .text(d => d)
        .style("font-size", "20px");


       // Y Axis Label
       svg2.append("text")
       .attr("transform", "rotate(-90)")
       .attr("x", -graphHeight3 / 2 - margin3.top)
       .attr("y", margin3.left - 80)
       .attr("text-anchor", "middle")
       .style("font-size", "20px")
       .style("font-weight", "bold")
       .text("Number of Passengers");



        // Add X Axis Label
        svg2.append("text")
        .attr("x", graphWidth / 2 + margin.left)
        .attr("y", graphHeight + margin.bottom +10)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Gender");
});
