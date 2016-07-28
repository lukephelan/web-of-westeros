// Set variables for the SVG
var width = 1440,
    height = 700,
    graph;

// Append the SVG to the force-graph div and assign this SVG as an object
var svg = d3.select(".force-graph")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("pointer-events", "all")
    .append("g")
    .call(d3.behavior.zoom().on("zoom", redraw))
    .append("g");

// Append a background to the SVG to receive pointer events for zoom and pan
svg.append("svg:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "transparent");

// Defs element for the filters
var defs = svg.append("defs");

// Create a filter with id #drop-shadow
// Set height so the shadow is not clipped
var filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%");

// SourceAlpha refers to opacity of graphic that this filter will be applied to
// convolve that with a Gaussian with standard deviation 3 and store result
// in blur
filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 2)
    .attr("result", "blur");

// Translate output of Gaussian blur to the right and down
// Store result in offsetBlur
filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 2)
    .attr("dy", 2)
    .attr("result", "offsetBlur");

// Overlay original SourceGraphic over translated blurred opacity by using
// feMerge filter. Order of specifying inputs is important.
var feMerge = filter.append("feMerge");

feMerge.append("feMergeNode")
    .attr("in", "offsetBlur")
feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");

// Redraw the graph after zooming or panning
function redraw(){
    svg.attr("transform",
        "translate(" + d3.event.translate + ")"
        + " scale(" + d3.event.scale + ")");
};

// Retrieve data from the Neo4j database API, then call the draw function
d3.json("http://localhost:8080/json", function(err, json){
    if (err) throw err;
    graph = json;
    draw();
});

// Create the graph data structure out of the json data
function draw(){
    // Set the force layout
    var force = d3.layout.force()
        .nodes(graph.nodes)
        .links(graph.links)
        .size([width, height])
        .linkDistance(50)
        .charge(-700)
        .gravity(0.075)
        .start();

    // Prevent pan event when dragging a node
    var drag = force.drag()
        .on("dragstart", function() { d3.event.sourceEvent.stopPropagation(); })

    // Create all the links without a location
    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("id",function(d,i) {return "link"+i});
        // I"ve taken out the arrowheads because they don"t look very good
        // .attr("marker-end","url(#arrowhead)")
        // .style("stroke-width", 2);

    // Create a path for the links - we need this for the link labels
    var linkpaths = svg.selectAll(".linkpath")
        .data(graph.links)
        .enter()
        .append("path")
        .attr({"d": function(d) {return "M "+d.source.x+" "+d.source.y+" L "+ d.target.x +" "+d.target.y},
            "class":"linkpath",
            "fill-opacity":0,
            "stroke-opacity":0,
            "fill":"blue",
            "stroke":"red",
            "id":function(d,i) {return "linkpath"+i}})
        .style("pointer-events", "none");

    // Create the link labels
    var linklabels = svg.selectAll(".linklabel")
        .data(graph.links)
        .enter()
        .append("text")
        .style("pointer-events", "none")
        .attr({"class":"linklabel",
            "id":function(d,i){return "linklabel"+i},
            "dx":35,
            "dy":10,
            "font-size":10,
            "fill":"grey"});

    // Attach the link labels to the link paths
    linklabels.append("textPath")
        .attr("xlink:href",function(d,i) {return "#linkpath"+i})
        .style("pointer-events", "none")
        .text(function(d,i){return d.name});

    // I"ve taken out the arrowheads because they don"t look very good
    // svg.append("defs").append("marker")
    //     .attr({"id":"arrowhead",
    //         "viewBox":"-0 -5 10 10",
    //         "refX":25,
    //         "refY":0,
    //         "orient":"auto",
    //         "markerWidth":10,
    //         "markerHeight":10,
    //         "xoverflow":"visible"})
    //     .append("svg:path")
    //         .attr("d", "M 0,-5 L 10 ,0 L 0,5")
    //         .attr("fill", "#ccc")
    //         .attr("stroke","#ccc");


    // Create all the nodes
    var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .on("dblclick", function(d) {
            // Display the info modal when double clicking on the node
            if (d.profile) {
                $.ajax({
                    type: "GET",
                    url: "http://gameofthrones.wikia.com/api/v1/Articles/AsSimpleJson?id="+d.profile,
                    success: function(data){
                        var contentName = data.sections[0].title;
                        var contentBio =[];
                        for (i = 0; i < data.sections[0].content.length; i++){
                            contentBio.push(data.sections[0].content[i].text);
                        };
                        $("#name").append(contentName);
                        $("#profile-pic").append("<img src=" + d.img + "/>");
                        for (i = 0; i < contentBio.length; i++){
                            $("#bio").append(contentBio[i] + "<br><br>");
                        };
                    }
                });
            } else {
                $("#bio").append("Sorry, this character is so obscure there\'s not enough information to give you!");
            };
            $(".modal").css("display", "block");
        })
        .call(drag);

    // Prevent window from zooming in when double-clicking a node
    node.on("dblclick.zoom", function(d) { d3.event.stopPropagation()});;

    // Append an image to the node from the URL in the database
    node.append("image")
        .attr("class", "image")
        .attr("xlink:href", function(d) {
            return d.img
        })
        .attr("x", function(d) { return -25;})
        .attr("y", function(d) { return -25;})
        .attr("height", 50)
        .attr("width", 50)
        .style("filter", "url(#drop-shadow)");

    // Append a label to each node from the name field in the database
    node.append("text")
          .attr("dx", 25)
          .attr("dy", -25)
          .text(function(d) { return d.name })
          .style("fill", "black");

    // Give the SVG coordinates
    force.on("tick", function(){

        link.attr("x1", function (d){ return d.source.x; })
            .attr("y1", function (d){ return d.source.y; })
            .attr("x2", function (d){ return d.target.x; })
            .attr("y2", function (d){ return d.target.y; });

        linkpaths.attr("d", function(d){
            var path = "M " + d.source.x + " " + d.source.y + " L " + d.target.x +
                " " + d.target.y;
            return path
        });

        linklabels.attr("transform", function(d, i){
            if (d.target.x < d.source.x){
                bbox = this.getBBox();
                rx = bbox.x + bbox.width / 2;
                ry = bbox.y + bbox.height / 2;
                return "rotate(180 " + rx + " " + ry + ")";
                }
            else {
                return "rotate(0)";
                }
            });

        d3.selectAll("image")
            .attr("x", function (d){ return d.x - 25; })
            .attr("y", function (d){ return d.y - 25; });

        d3.selectAll("text")
            .attr("x", function (d){ return d.x; })
            .attr("y", function (d){ return d.y; });
    });

// ===== COLLISION DETECTION =====

    var padding = 50, // Separation between nodes
        radius = 50;
    function collide(alpha){
        var quadtree = d3.geom.quadtree(graph.nodes);
        return function(d){
            var rb = 2 * radius + padding,
                nx1 = d.x - rb,
                nx2 = d.x + rb,
                ny1 = d.y - rb,
                ny2 = d.y + rb;
                quadtree.visit(function(quad, x1, y1, x2, y2){
                    if (quad.point && (quad.point !== d)) {
                        var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y);
                        if (l < rb) {
                            l = (l - rb) / l * alpha;
                            d.x -= x *= l;
                            d.y -= y *= l;
                            quad.point.x += x;
                            quad.point.y += y;
                        }
                    }
                    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
                });
            };
        }

    // ===== SEARCH =====

    var optArray = [];
    for (var i = 0; i < graph.nodes.length - 1; i++) {
        optArray.push(graph.nodes[i].name);
    }
    optArray = optArray.sort();
    $(function () {
        $("#search").autocomplete({
            source: optArray,
            position: { my : "top", at: "bottom" }
        });
    });
};

function searchNode(){
    // Find the node
    var selectedVal = document.getElementById("search").value;
    var node = svg.selectAll(".node");
    if (selectedVal == "none"){
        node.style("stroke", "white")
        .style("stroke-width", "1");
    } else {
        var selected = node.filter(function (d, i){
            return d.name != selectedVal;
        });
        selected.style("opacity", "0");
        var link = svg.selectAll(".link")
        link.style("opacity", "0");
        var linklabel = svg.selectAll(".linklabel")
        linklabel.style("opacity", "0");
        d3.selectAll(".node, .link, .linklabel")
            .transition()
            .duration(5000)
            .style("opacity", 1);
    }
}
