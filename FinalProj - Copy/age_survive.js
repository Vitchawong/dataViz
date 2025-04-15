const canvas5 = d3.select("#canvas5");

const svg5 = canvas5.append("svg")
    .attr('width', 800)
    .attr("height", 800);

const margin5 = { top: 30, right: 20, bottom: 70, left: 60 };
const graphWidth5 = 800 - margin5.left - margin5.right;
const graphHeight5 = 800 - margin5.top - margin5.bottom;

const graph5 = svg5.append('g')
    .attr("width", graphWidth5)
    .attr("height", graphHeight5)
    .attr("transform", `translate(${margin5.left},${margin5.top})`);

const xAxisGroup5 = graph5.append('g')
    .attr('transform', `translate(0, ${graphHeight5})`);
const yAxisGroup5 = graph5.append('g');
d3.json("titanic.json").then(data => {
    // Filter data to remove entries with missing Age
    const validData = data.filter(d => d.Age != null);

    // Define age bins (0-10, 10-20, ..., 70-80)
    const ageBins = d3.range(0, 81, 20);

    // Categorize each passenger into an age group
    const groupedData = validData.map(d => {
        const age = +d.Age;
        const binIndex = d3.bisectLeft(ageBins, age) - 1;
        const bin = `${ageBins[binIndex]}-${ageBins[binIndex + 1]}`;
        return {
            ...d,
            ageGroup: bin,
            survived: d.Survived === "1"
        };
    });

    // Count survivors and non-survivors per age group
    const ageGroups = [...new Set(groupedData.map(d => d.ageGroup))].sort();
    const countsByAgeGroup = ageGroups.map(ageGroup => {
        const groupData = groupedData.filter(d => d.ageGroup === ageGroup);
        const survivors = groupData.filter(d => d.survived).length;
        const nonSurvivors = groupData.filter(d => !d.survived).length;
        return {
            ageGroup,
            survivors,
            nonSurvivors: nonSurvivors
        };
    });

    // Stack the data
    const stack = d3.stack()
        .keys(["survivors", "nonSurvivors"])
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);

    const stackedData = stack(countsByAgeGroup);

    // X scale (age groups)
    const x = d3.scaleBand()
        .domain(ageGroups)
        .range([0, graphWidth5])
        .padding(0.2);

    // Y scale (total count per age group)
    const y = d3.scaleLinear()
        .domain([0, d3.max(countsByAgeGroup, d => d.survivors + d.nonSurvivors)])
        .nice()
        .range([graphHeight5, 0]);

    // Color scale for the stacks
    const color = d3.scaleOrdinal()
        .domain(["survivors", "nonSurvivors"])
        .range(["#00ced1", "pink"]);

    // Draw the stacked bars
    graph5.selectAll(".age-group")
        .data(stackedData)
        .enter().append("g")
        .attr("class", "age-group")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter().append("rect")
        .attr("x", d => x(d.data.ageGroup))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth());

// Add percentage labels inside bars
graph5.selectAll(".label-group")
    .data(stackedData)
    .enter()
    .append("g")
    .attr("fill", "black") // or any contrasting color
    .attr("text-anchor", "middle")
    .attr("font-size", "20px")
    .selectAll("text")
    .data(d => d)
    .enter()
    .append("text")
    .attr("x", d => x(d.data.ageGroup) + x.bandwidth() / 2)
    .attr("y", d => (y(d[0]) + y(d[1])) / 2)
    .text(d => {
        const total = d.data.survivors + d.data.nonSurvivors;
        const value = d[1] - d[0];
        const percent = (value / total) * 100;
        return `${percent.toFixed(1)}%`;
    });

    // Axes
    xAxisGroup5.call(d3.axisBottom(x));
    xAxisGroup5.selectAll("text")
    .style("font-size", "16px");
    yAxisGroup5.call(d3.axisLeft(y));
    yAxisGroup5.selectAll("text")
    .style("font-size", "16px");

    // Title
    svg5.append("text")
        .attr("x", graphWidth5 / 2 + margin5.left)
        .attr("y", margin5.top - 10)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Survivors and Non-Survivors by Age Group");

    // X-axis label
    svg5.append("text")
        .attr("x", graphWidth5 / 2 + margin5.left)
        .attr("y", graphHeight5 + margin5.top + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Age Group");

    // Y-axis label
    svg5.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -graphHeight5 / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Number of Passengers");

    // Legend
    const legend = svg5.append("g")
        .attr("transform", `translate(${graphWidth5 - 100}, ${margin5.top})`);

    legend.selectAll("rect")
        .data(color.domain())
        .enter().append("rect")
        .attr("x", 0)
        .attr("y", (d, i) => i * 20)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", color);

    legend.selectAll("text")
        .data(color.domain())
        .enter().append("text")
        .attr("x", 20)
        .attr("y", (d, i) => i * 20 + 12)
        .text(d => d === "survivors" ? "Survived" : "Did not survive")
        .style("font-size", "20px");
});
