import d3 from 'd3';
import {setCurrentArtist, similarArtists} from '../actions';

function createTree(rootNode) {
    console.log("PRINT THIS", rootNode);
    var margin = {top: 20, right: 120, bottom: 20, left: 120},
        width = 960 - margin.right - margin.left,
        height = 800 - margin.top - margin.bottom;

    var i = 0,
        duration = 750,
        root;

    var panSpeed = 200;
    var panBoundary = 20; // Within 20px from edges will pan when dragging.

    var tree = d3.layout.tree()
        .size([height, width]);

    var diagonal = d3.svg.diagonal()
        .projection(function(d) { return [d.y, d.x]; });

    function zoom() {
        svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
    var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);


    d3.select(".tree").html("");
    var svg = d3.select(".tree").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoomListener);

    //d3.json("flare.json", function(error, flare) {
    //if (error) throw error;

    //root = flare;
    root = rootNode;
    root.x0 = height / 2;
    root.y0 = 0;
    root.children = null;

    var svgGroup = svg.append("g");

    function collapse(d) {
        if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
        }
    }

    function pan(domNode, direction) {
        var speed = panSpeed;
        if (panTimer) {
            clearTimeout(panTimer);
            translateCoords = d3.transform(svgGroup.attr("transform"));
            if (direction == 'left' || direction == 'right') {
                translateX = direction == 'left' ? translateCoords.translate[0] + speed : translateCoords.translate[0] - speed;
                translateY = translateCoords.translate[1];
            } else if (direction == 'up' || direction == 'down') {
                translateX = translateCoords.translate[0];
                translateY = direction == 'up' ? translateCoords.translate[1] + speed : translateCoords.translate[1] - speed;
            }
            scaleX = translateCoords.scale[0];
            scaleY = translateCoords.scale[1];
            scale = zoomListener.scale();
            svgGroup.transition().attr("transform", "translate(" + translateX + "," + translateY + ")scale(" + scale + ")");
            d3.select(domNode).select('g.node').attr("transform", "translate(" + translateX + "," + translateY + ")");
            zoomListener.scale(zoomListener.scale());
            zoomListener.translate([translateX, translateY]);
            panTimer = setTimeout(function() {
                pan(domNode, speed, direction);
            }, 50);
        }
    }

    // Define the zoom function for the zoomable tree


    //root.children.forEach(collapse);
    update(root);

    //d3.select(self.frameElement).style("height", "800px");

    function update(source) {
            
        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        console.log("links", links);

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 180; });

        // Update the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function(d) { return d.id || (d.id = ++i); });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
            .on("click", function(d) {
                click(d);
                addNew(d);
            });

        // add picture
        nodeEnter
            .append('defs')
            .append('pattern')
            .attr('id', function(d,i){
            return 'pic_' + d.name;
            })
            .attr('height',1)
            .attr('width',1)
            .attr('x',0)
            .attr('y',0)
            .append('image')
            .attr('xlink:href',function(d,i){
            return d.image;
            })
            .attr('height',150)
            .attr('width',150)
            .attr('x',-35)
            .attr('y',-35);

        nodeEnter.append("circle")
            .attr("r", 1e-6)
            .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

        var g = nodeEnter.append("g");
        
        g.append("text")
            .attr("x", function(d) { return d.children || d._children ? -35 : 35; })
            .attr("dy", "1.35em")
            .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            .text(function(d) { return d.name; })
            .style("fill-opacity", 1e-6);
            
            // g.append("text")
            //   .attr("x", function(d) { return d.children || d._children ? -35 : 35; })
            //   .attr("dy", "2.5em")
            //   .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
            //   .text(function(d) { return d.title; })
            //   .style("fill-opacity", 1e-6);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        nodeUpdate.select("circle")
            .attr("r", 30)
            .style("fill", function(d,i){
                return 'url(#pic_' + d.name+')';
            });

        nodeUpdate.selectAll("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function(d) { return d.target.id; });

        // Enter any new links at the parent's previous position.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", function(d) {
                var o = {x: source.x0, y: source.y0};
                return diagonal({source: o, target: o});
            });

        // Transition links to their new position.
        link.transition()
            .duration(duration)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function(d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function(d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });

    }

    // Toggle children on click.
    function click(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }

    // Add new node when clicked
    function addNew(d) {
        console.log('d', d);
        if (!d.children && !d._children) {
            var tempNode = {
                id: 2,
                name: "Bobby",
                image: "https://i.scdn.co/image/5d8df557ac021cd75ba57d329e0ae745593d8a72",
                children: null
            };

            var tempNode2 = {
                id: 3,
                name: "Steve",
                image: "https://i.scdn.co/image/5d8df557ac021cd75ba57d329e0ae745593d8a72",
                children: null
            };
            d.children = [tempNode, tempNode2];
            update(d);
        }

    }
}

export default createTree;