const canvas = d3.select("#canvas");

var width = 600;
var height = 600;
const api_url ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

const svg = canvas.append("svg")
    .attr("width",width)
    .attr("height",height);


var div = d3.select("body").append('div')
    .attr('class',"tooltip")
    .style("opacity",0);

function timeStamptoDate(mTime){
    var mDate= new Date(mTime);
    return mDate.toLocaleDateString("en-US");
}

d3.json(api_url)
        .then(data=>{
            const circle = svg.selectAll("circle")
            .data(data.features);
        circle.attr("cx",(d,i)=>d.properties.mag)
            .attr('cy',(d,i)=>Math.floor(Math.random()*100)+d.properties.mag)
            .attr('r',(d,i)=>(2*d.properties.mag))
            .attr('fill',(d,i)=>(d.properties.alert))

        circle.enter()
                .append("circle")
            .attr("cx",(d,i)=>20*d.properties.mag)
            .attr('cy',(d,i)=>Math.floor(Math.random()*100)+d.properties.mag)
            .attr('r',(d,i)=>(2*d.properties.mag))
            .on("mouseover",function(d,i,n){
                d3.select(n[i])
                .transition()
                .duration(100)
                .style("opacity",0.5)
                .style("fill",'red')
                div.transition()
                .duration(200)
                .style('opacity',0.9);
                div.html("<p>"+d.properties.mag+"</p>"
                    +"<p> Time:"+timeStamptoDate(d.properties.time)+"</p>"
                    +"<p> Location:"+d.properties.place.split(",")[1]+"</p>"
                )
                .style('left',(d3.event.pageX)+"px")
                .style("top",(d3.event.pageY)+"px")

            })
            .on("mouseout",function(d,i,n){
                d3.select(n[i])
                .transition()
                .duration(100)
                .style("opacity",1)
                .style("fill",d.properties.alert)

                div.transition()
                .duration(500)
                .style("opacity",0)

            })
            .attr('fill',(d,i)=>(d.properties.alert))
        })