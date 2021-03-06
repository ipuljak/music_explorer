import d3 from 'd3';
import { setCurrentArtist, getArtistInfo, getSimilar, getTracks } from '../actions';

function createTree(treeData) {
  // Misc. variables
  var i = 0;
  var duration = 750;
  var root;

  // size of the diagram
  var viewerWidth = document.documentElement.clientWidth * 0.666;
  var viewerHeight = document.documentElement.clientHeight - 5;

  var tree = d3.layout.tree()
    .size([viewerHeight, viewerWidth]);

  // define a d3 diagonal projection for use by the node paths later on.
  var diagonal = d3.svg.diagonal()
    .projection(function (d) {
      return [d.y, d.x];
    });

  // Define the zoom function for the zoomable tree
  function zoom() {
    svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }

  // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
  var zoomListener = d3.behavior.zoom().scaleExtent([0.1, 3]).on("zoom", zoom);

  // define the baseSvg, attaching a class for styling and the zoomListener
  d3.select(".tree").html("");
  var baseSvg = d3.select(".tree").append("svg")
    .attr("width", viewerWidth)
    .attr("height", viewerHeight)
    .attr("class", "overlay")
    .call(zoomListener);

  // Append a group which holds all nodes and which the zoom Listener can act upon.
  var svgGroup = baseSvg.append("g");

  // Function to center node when clicked/dropped so node doesn't get lost when collapsing/moving with large amount of children.
  function centerNode(source) {
    var scale = zoomListener.scale();
    var x = -source.y0;
    var y = -source.x0;
    x = x * scale + viewerWidth / 2;
    y = y * scale + viewerHeight / 2;
    d3.select('g').transition()
      .duration(duration)
      .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    zoomListener.scale(scale);
    zoomListener.translate([x, y]);
  }

  function addNew(d, ids) {
    if (!d.children && !d._children) {
      setCurrentArtist(d);
      getArtistInfo(d.name);
      getTracks(d.aid);
      var newNodes = [];
      var promiseResult = getSimilar(d.aid);

      promiseResult.then(function (result) {
        for (var x = 0; x < result.length; x++) {
          var node = {
            id: ids + (x + 1),
            aid: result[x].id,
            name: result[x].name,
            children: null,
            image: result[x].images[result[x].images.length - 2].url
          };
          newNodes.push(node);
        }

        d.children = newNodes;
        update(d);
        centerNode(d);
      });
    }
  }

  /**
   * Compute the new height, function counts total children of root node and sets tree height accordingly.
   * This prevents the layout looking squashed when new nodes are made visible or looking sparse when nodes are removed
   * This makes the layout more consistent.
   */
  function update(source) {

    var levelWidth = [1];
    var childCount = function (level, n) {

      if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) levelWidth.push(0);

        levelWidth[level + 1] += n.children.length;
        n.children.forEach(function (d) {
          childCount(level + 1, d);
        });
      }
    };

    childCount(0, root);

    var newHeight = d3.max(levelWidth) * 100; // 25 pixels per line  
    tree = tree.size([newHeight, viewerWidth]);

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Set widths between levels based on maxLabelLength.
    nodes.forEach(function (d) {
      // alternatively to keep a fixed scale one can set a fixed depth per level
      // Normalize for fixed-depth by commenting out below line
      d.y = (d.depth * 180); //500px per level.
    });

    // Update the nodes…
    var node = svgGroup.selectAll("g.node")
      .data(nodes, function (d) {
        return d.id || (d.id = ++i);
      });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click", function (d) {
        var znodes = tree.nodes(root).length;
        addNew(d, znodes);
      });

    // add picture
    nodeEnter
      .append('defs')
      .append('pattern')
      .attr('id', function (d, i) {
        return 'pic_' + d.id;
      })
      .attr('height', 1)
      .attr('width', 1)
      .attr('x', 0)
      .attr('y', 0)
      .append('image')
      .attr('xlink:href', function (d, i) {
        return d.image;
      })
      .attr('height', 100)
      .attr('width', 100)
      .attr('x', -20)
      .attr('y', -20);

    nodeEnter.append("circle")
      .attr('class', 'nodeCircle')
      .attr("r", 0)
      .style("fill", function (d) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    nodeEnter.append("text")
      .attr("x", function (d) {
        return d.children || d._children ? -35 : 35;
      })
      .attr("dy", ".35em")
      .attr('class', 'nodeText')
      .attr("text-anchor", function (d) {
        return d.children || d._children ? "end" : "start";
      })
      .attr("font-size", "20px")
      .text(function (d) {
        return d.name;
      })
      .style("fill-opacity", 0);

    // Update the text to reflect whether node has children or not.
    node.select('text')
      .attr("x", function (d) {
        return d.children || d._children ? -35 : 35;
      })
      .attr("text-anchor", function (d) {
        return d.children || d._children ? "end" : "start";
      })
      .attr("font-size", "50px")
      .text(function (d) {
        return d.name;
      })
      .style("fill", "#fff");

    // Change the circle fill depending on whether it has children and is collapsed
    node.select("circle.nodeCircle")
      .attr("r", 30)
      .style("fill", function (d, i) {
        return 'url(#pic_' + d.id + ')';
      });

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    // Fade the text in
    nodeUpdate.select("text")
      .style("fill-opacity", 1)
      .attr("font-size", "20px");

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select("circle")
      .attr("r", 0);

    nodeExit.select("text")
      .style("fill-opacity", 0);

    // Update the links…
    var link = svgGroup.selectAll("path.link")
      .data(links, function (d) {
        return d.target.id;
      });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function (d) {
        var o = {
          x: source.x0,
          y: source.y0
        };
        return diagonal({
          source: o,
          target: o
        });
      });

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function (d) {
        var o = {
          x: source.x,
          y: source.y
        };
        return diagonal({
          source: o,
          target: o
        });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Define the root
  root = treeData;
  root.x0 = viewerHeight / 2;
  root.y0 = 0;

  // Layout the tree initially and center on the root node.
  update(root);
  centerNode(root);
}

export default createTree;