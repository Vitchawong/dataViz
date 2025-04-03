const canvas = d3.select("#canvas");

const svg = canvas.append("svg")
    .attr("width", 400)
    .attr("height", 400);

// Bottom Circle (Body)
svg.append("circle")
    .attr("cx", 100).attr("cy", 200)
    .attr("r", 50)
    .attr("fill", "white")
    .attr("stroke", "black").attr("stroke-width", 3);

// Middle Circle (Body)
svg.append("circle")
    .attr("cx", 100).attr("cy", 130)
    .attr("r", 40)
    .attr("fill", "white")
    .attr("stroke", "black").attr("stroke-width", 3);

// Top Circle (Head)
svg.append("circle")
    .attr("cx", 100).attr("cy", 60)
    .attr("r", 30)
    .attr("fill", "white")
    .attr("stroke", "black").attr("stroke-width", 3);

// Eyes
svg.append("circle").attr("cx", 90).attr("cy", 50).attr("r", 3).attr("fill", "black");
svg.append("circle").attr("cx", 110).attr("cy", 50).attr("r", 3).attr("fill", "black");


// Arms (Stick Hands)
svg.append("line")
    .attr("x1", 60).attr("y1", 120)
    .attr("x2", 20).attr("y2", 100)
    .attr("stroke", "brown").attr("stroke-width", 3);
svg.append("line")
    .attr("x1", 140).attr("y1", 120)
    .attr("x2", 180).attr("y2", 100)
    .attr("stroke", "brown").attr("stroke-width", 3);
