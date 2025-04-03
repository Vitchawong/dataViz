const canvas = d3.select("#canvas");


// var dataArray = [{width:25,height:45,fill:"pink"},
//     {width:25,height:30,fill:"green"},
//     {width:25,height:20,fill:"red"}
// ]

const svg = canvas.append("svg")
            .attr('width',600 )
            .attr("height",600)


const rect = svg.selectAll("rect")

d3.json("text.json")
.then(data =>{
rect.data(data)
    .enter().append("rect")
    .attr("width",24)
    .attr("fill",function(d,i){
        return d.fill;
    })
    .attr("height",function(d){
        return d.height;
    })
    
    .attr("x",function(d,i){return i*25;})
    .attr("y", function(d,i){
        return 100-d.height;
    })
})
