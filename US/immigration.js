const canvas6 = d3.select("#canvas");

const svg6 = canvas6.append("svg")
    .attr("width", 1000)
    .attr("height", 1000);

const padding = 1.5,
    clusterPadding = 16,
    maxRadius = 15;

const margin6 = { top: 30, right: 20, bottom: 70, left: 60 };
const graphWidth6 = 600 - margin6.left - margin6.right;
const graphHeight6 = 600 - margin6.top - margin6.bottom;

const mainCanvas = svg6.append("g")
    .attr("width", graphWidth6 / 2)
    .attr("height", graphHeight6 / 2)
    .attr("transform", `translate(${margin6.left},${margin6.top + 160})`);

// D3 Tip
const formatComma = d3.format(",");
const tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([0, -3])
    .direction("e")
    .html(function(d) {
        return `<div id='thumbnail'><h3> Form: ${d.form_type}</h3></div>
                Pending: <span style='color:orange'>${formatComma(d.pending)}</span>
                <p>Denied: <span style='color:orangered'>${formatComma(d.denied)}</span></p>
                <p>Approved: <span style='color:orange'>${formatComma(d.approved)}</span></p>
                <p>Total Received: <span style='color:orange'>${formatComma(d.received)}</span></p>
                <p>Description: <span style='color:orange'>${d.form_description}</span></p>
                <p>Base Type: <span style='color:orange'>${d.base_type}</span></p>`;
    });

mainCanvas.call(tip);

function getCSVData() {
    d3.csv("uscis-forms-new.csv").then(function (data) {
        data.forEach(d => {
            d.received = +d.received;
            d.approved = +d.approved;
            d.denied = +d.denied;
            d.pending = +d.pending;
            d.category_code = +d.category_code;
        });

        const baseTypes = Array.from(new Set(data.map(d => d.base_type)));
        const mColors = d3.scaleOrdinal()
            .domain(baseTypes)
            .range(d3.schemeSet2);

        const categoryCodes = data.map(d => d.category_code);
        const distinctTypesScale = Array.from(new Set(categoryCodes)).length;

        const clusters = new Array(distinctTypesScale);

        const radiusScale = d3.scaleSqrt()
            .domain(d3.extent(data, d => d.received))
            .range([5, maxRadius + 20]);

        const nodes = data.map((datum, index) => {
            const i = datum.category_code;
            const r = radiusScale(datum.received);

            const node = {
                cluster: i,
                radius: r,
                base_type: datum.base_type,
                form_type: datum.form_type,
                form_description: datum.form_description,
                received: datum.received,
                denied: datum.denied,
                approved: datum.approved,
                pending: datum.pending,
                x: Math.cos(index / data.length * 2 * Math.PI) * 200 + graphWidth6 / 2 + Math.random(),
                y: Math.sin(index / data.length * 2 * Math.PI) * 200 + graphHeight6 / 2 + Math.random()
            };

            if (!clusters[i] || (r > clusters[i].radius)) {
                clusters[i] = node;
            }

            return node;
        });

        const force = d3.forceSimulation()
            .force("center", d3.forceCenter(graphWidth6 / 2, graphHeight6 / 2))
            .force("cluster", clusterForce().strength(0.7))
            .force("collide", d3.forceCollide(d => d.radius + padding).strength(0.9))
            .velocityDecay(0.4)
            .on("tick", layoutTick)
            .nodes(nodes);

        const node = mainCanvas.selectAll("circle")
            .data(nodes)
            .enter()
            .append("circle")
            .style("fill", d => mColors(d.base_type))
            .on("mouseover", tip.show)
            .on("mouseout", tip.hide);

        function layoutTick() {
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r", d => d.radius);
        }

        function clusterForce() {
            let nodes;
            let strength = 0.1;

            function force(alpha) {
                alpha *= strength * alpha;
                nodes.forEach(d => {
                    const cluster = clusters[d.cluster];
                    if (!cluster || cluster === d) return;

                    let x = d.x - cluster.x;
                    let y = d.y - cluster.y;
                    let l = Math.sqrt(x * x + y * y);
                    let r = d.radius + cluster.radius;

                    if (l !== r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        cluster.x += x;
                        cluster.y += y;
                    }
                });
            }

            force.initialize = function (_) {
                nodes = _;
            };

            force.strength = _ => {
                strength = _ == null ? strength : _;
                return force;
            };

            return force;
        }

        // ➕ Color Legend
        const legend = svg6.append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", `translate(${graphWidth6 + margin6.left + 100}, ${margin6.top})`);

        const legendOrdinal = d3.legendColor()
            .shape("circle")
            .shapeRadius(7)
            .shapePadding(10)
            .scale(mColors)
            .title("Base Type");

        legend.call(legendOrdinal);

        // ➕ Size Legend (Custom Visual)
        const sizeLegendGroup = svg6.append("g")
            .attr("class", "custom-size-legend")
            .attr("transform", `translate(${graphWidth6 + margin6.left + 50}, ${margin6.top + 300})`);

        const sizeScale = d3.scaleSqrt()
            .domain(d3.extent(data, d => d.received))
            .range([15, 25]);

        const legendValues = d3.range(5).map(i => d3.interpolate(...sizeScale.domain())(i / 4));
        const circleSpacing = 60;

        sizeLegendGroup.selectAll("circle")
            .data(legendValues)
            .enter()
            .append("circle")
            .attr("cx", (d, i) => i * circleSpacing)
            .attr("cy", 0)
            .attr("r", d => sizeScale(d))
            .attr("fill", "#9FBFF9");

        // Text below first (less) and last (more) circles
        sizeLegendGroup.append("text")
            .text("Size Legend")
            .attr("x", -10)
            .attr("y", -30)
            .attr("text-anchor", "start")
            .attr("fill", "white")
            .style("font-size", "14px")
            .style("font-weight", "bold");

        sizeLegendGroup.append("text")
            .text("Less")
            .attr("x", 0)
            .attr("y", 40)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .style("font-size", "12px")
            .style("font-weight", "bold");

        sizeLegendGroup.append("text")
            .text("Applications")
            .attr("x", 0)
            .attr("y", 55)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .style("font-size", "12px");

        sizeLegendGroup.append("text")
            .text("Received")
            .attr("x", 0)
            .attr("y", 70)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .style("font-size", "12px");

        const lastX = (legendValues.length - 1) * circleSpacing;

        sizeLegendGroup.append("text")
            .text("More")
            .attr("x", lastX)
            .attr("y", 40)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .style("font-size", "12px")
            .style("font-weight", "bold");

        sizeLegendGroup.append("text")
            .text("Applications")
            .attr("x", lastX)
            .attr("y", 55)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .style("font-size", "12px");

        sizeLegendGroup.append("text")
            .text("Received")
            .attr("x", lastX)
            .attr("y", 70)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .style("font-size", "12px");
    });
}



getCSVData();
