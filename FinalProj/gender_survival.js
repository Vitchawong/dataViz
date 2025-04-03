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
            if (d.Survived === "1") {
                male_survive += 1;
            }
        }
        if (d.Sex === "female") {
            female_total += 1;
            if (d.Survived === "1") {
                female_survive += 1;
            }
        }
    });

    // Calculate non-survivors
    let male_not_survive = male_total - male_survive;
    let female_not_survive = female_total - female_survive;

    const dataset2 = [
        { Sex: "male", SurviveCount: male_survive, NotSurviveCount: male_not_survive },
        { Sex: "female", SurviveCount: female_survive, NotSurviveCount: female_not_survive }
    ];

    console.log(dataset2);

    const y = d3.scaleLinear()
        .domain([0, d3.max(dataset2, d => d.SurviveCount + d.NotSurviveCount)]) 
        .range([graphHeight2, 0]);

    const x = d3.scaleBand()
        .domain(dataset2.map(d => d.Sex))
        .range([0, graphWidth2])
        .padding(0.2);

    // 📌 **Appending Bars for Survivors**
    graph2.selectAll(".survivor-bar")
        .data(dataset2)
        .enter().append("rect")
        .attr("class", "survivor-bar")
        .attr("width", x.bandwidth() / 2) // Half width to prevent overlap
        .attr("fill", d => d.Sex === "male" ? "cyan" : "pink")
        .attr("x", d => x(d.Sex)) 
        .attr("height", d => graphHeight2 - y(d.SurviveCount)) 
        .attr("y", d => y(d.SurviveCount));

    // 📌 **Appending Bars for Non-Survivors**
    graph2.selectAll(".nonsurvivor-bar")
        .data(dataset2)
        .enter().append("rect")
        .attr("class", "nonsurvivor-bar")
        .attr("width", x.bandwidth() / 2) 
        .attr("fill", "black") // Non-survivors in black
        .attr("x", d => x(d.Sex) + x.bandwidth() / 2) // Offset to the right
        .attr("height", d => graphHeight2 - y(d.NotSurviveCount)) 
        .attr("y", d => y(d.NotSurviveCount));

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    xAxisGroup2.call(xAxis);
    yAxisGroup2.call(yAxis);

    // 📌 **ADDING TITLE**
    svg2.append("text")
        .attr("x", graphWidth2 / 2 + margin2.left)
        .attr("y", margin2.top - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Titanic Survivors vs Non-Survivors by Gender");

    // 📌 **ADDING LEGEND**
    const legend = svg2.append("g")
        .attr("transform", `translate(${graphWidth2 - 120}, ${margin2.top})`);

    legend.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "cyan");

    legend.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text("Survived (Male)");

    legend.append("rect")
        .attr("y", 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "pink");

    legend.append("text")
        .attr("x", 20)
        .attr("y", 32)
        .text("Survived (Female)");

    legend.append("rect")
        .attr("y", 40)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", "black");

    legend.append("text")
        .attr("x", 20)
        .attr("y", 52)
        .text("Did Not Survive");
});
