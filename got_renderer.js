// Setup our constants for the SVG
var width = 1440,
    height = 800,
    graph;

// Setup the colour scale
var color = d3.scale.category20b();

// Append a SVG to the body of the html page and ssign this SVG as an object
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Setup the force layout
var force = d3.layout.force()
    .charge(-200)
    .linkDistance(100)
    .size([width, height]);

// Retrieve data from the database API
d3.json('http://localhost:8080/json', function(err, json){
    if (err) throw err;
    graph = json;
    // return json;
    update();
});

function update(){

    //Create the graph data structure out of the json data
    force.nodes(graph.nodes)
        .links(graph.links)
        .start();

    //Create all the lines but without locations yet
    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter()
        .append("line")
        .attr("class", "link")
        .style("stroke-width", 2);

    var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(force.drag);

    // Append a circle to the node
    node.append("circle")
        .attr("r", 8)
        .attr("fill", function(d) {
           return color(d.img);
       });
        // .style("fill", function (d) {
        //     return color(d.group);
        // });

    // Append an image to the circle
    // node.append("image")
    //     .attr("xlink:href", function(d) {
    //         return d.img
    //     })
    //     .attr("x", function(d) { return -25;})
    //     .attr("y", function(d) { return -25;})
    //     .attr("height", 50)
    //     .attr("width", 50)
    //     .style("border-radius", "50%");

    // node.append("div")
    //     .attr("class", "

    node.append("text")
          .attr("dx", 10)
          .attr("dy", ".35em")
          .text(function(d) { return d.name })
          .style("stroke", "white");

         //Now we are giving the SVGs co-ordinates - the force layout is generating the co-ordinates which this code is using to update the attributes of the SVG elements
    force.on("tick", function () {

        link.attr("x1", function (d) {
            return d.source.x;
        })
            .attr("y1", function (d) {
            return d.source.y;
        })
            .attr("x2", function (d) {
            return d.target.x;
        })
            .attr("y2", function (d) {
            return d.target.y;
        });

        d3.selectAll("circle")
            .attr("cx", function (d) {
            return d.x;
        })
            .attr("cy", function (d) {
            return d.y;
        });

        d3.selectAll("image")
            .attr("x", function (d) {
            return d.x - 25;
        })
            .attr("y", function (d) {
            return d.y - 25;
        });

        d3.selectAll("text")
            .attr("x", function (d) {
            return d.x;
        })
            .attr("y", function (d) {
            return d.y;
        });
    });

// ===== COLLISION DETECTION =====

    var padding = 1, // separation between circles
        radius=8;
    function collide(alpha) {
      var quadtree = d3.geom.quadtree(graph.nodes);
      return function(d) {
        var rb = 2*radius + padding,
            nx1 = d.x - rb,
            nx2 = d.x + rb,
            ny1 = d.y - rb,
            ny2 = d.y + rb;
        quadtree.visit(function(quad, x1, y1, x2, y2) {
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


    // ===== SEARCH FUNCTION =====

    var optArray = [];
    for (var i = 0; i < graph.nodes.length - 1; i++) {
        optArray.push(graph.nodes[i].name);
    }
    optArray = optArray.sort();
    $(function () {
        $("#search").autocomplete({
            source: optArray
        });
    });

};

function searchNode() {
    //find the node
    var selectedVal = document.getElementById('search').value;
    var node = svg.selectAll(".node");
    if (selectedVal == "none") {
        node.style("stroke", "white").style("stroke-width", "1");
    } else {
        var selected = node.filter(function (d, i) {
            return d.name != selectedVal;
        });
        selected.style("opacity", "0");
        var link = svg.selectAll(".link")
        link.style("opacity", "0");
        d3.selectAll(".node, .link").transition()
            .duration(5000)
            .style("opacity", 1);
    }
}
