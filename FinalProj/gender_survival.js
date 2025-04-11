const canvas2 = d3.select("#canvas2");

const svg2 = canvas2.append("svg")
    .attr('width', 600)
    .attr("height", 600);

const margin2 = { top: 50, right: 20, bottom: 70, left: 60 };
const graphWidth2 = 600 - margin2.left - margin2.right;
const graphHeight2 = 600 - margin2.top - margin2.bottom;

const graph2 = svg2.append('g')
    .attr("width", graphWidth2)
    .attr("height", graphHeight2)
    .attr("transform", `translate(${margin2.left},${margin2.top})`);

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

    const maleData = [
        { label: "Survived", count: male_survive },
        { label: "Did Not Survive", count: male_total - male_survive }
    ];

    const femaleData = [
        { label: "Survived", count: female_survive },
        { label: "Did Not Survive", count: female_total - female_survive }
    ];

    const pie = d3.pie().value(d => d.count);
    const arc = d3.arc().innerRadius(0).outerRadius(100);
    const color = d3.scaleOrdinal()
        .domain(["Survived", "Did Not Survive"])
        .range(["#00ced1", "pink"]);

    const spacing = 80; // add horizontal spacing between the pie charts

    // 🥧 Male Pie Chart
    const maleGroup = graph2.append("g")
        .attr("transform", `translate(${graphWidth2 / 2 - 100 - spacing / 2}, ${graphHeight2 / 2})`);

    maleGroup.selectAll("path")
        .data(pie(maleData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.label));

    maleGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -120)
        .style("font-size", "14px")
        .text("Male");

    // 🥧 Female Pie Chart
    const femaleGroup = graph2.append("g")
        .attr("transform", `translate(${graphWidth2 / 2 + 100 + spacing / 2}, ${graphHeight2 / 2})`);

    femaleGroup.selectAll("path")
        .data(pie(femaleData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.label));

    femaleGroup.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -120)
        .style("font-size", "14px")
        .text("Female");

    // 🏷️ Title
    svg2.append("text")
        .attr("x", graphWidth2 / 2 + margin2.left)
        .attr("y", margin2.top - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Titanic Survivors vs Non-Survivors by Gender");

    // 🧭 Legend
    const legend = svg2.append("g")
        .attr("transform", `translate(${graphWidth2 - 150}, ${margin2.top})`);

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
        .text(d => d);


// ♂️ Percentage inside male pie
const malePercent = Math.round((male_survive / male_total) * 100);
maleGroup.append("text")
.attr("x", -20)
    .attr("text-anchor", "middle")
    .attr("dy", "-3.35em")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text(malePercent + "%");

maleGroup.append("text")
.attr("text-anchor", "middle")

.attr("dy", "3.05em")
.style("font-size", "16px")
.style("font-weight", "bold")
.text(100-malePercent + "%");

// ♀️ Percentage inside female pie
const femalePercent = Math.round((female_survive / female_total) * 100);
femaleGroup.append("text")
.attr("x", 30) // moves text 20px to the right inside the pie group
    .attr("text-anchor", "middle")
    .attr("dy", "3.35em")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text(femalePercent + "%");

femaleGroup.append("text")
.attr("x", -30) // moves text 20px to the right inside the pie group
    .attr("text-anchor", "middle")
    .attr("dy", "-3.35em")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text(100-femalePercent + "%");

});