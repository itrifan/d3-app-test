import * as d3 from "d3";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from "./forceGraph.module.css";
import { saveAs } from "file-saver";

export function runForceGraph(container, data, button, dragButton) {
  const root = d3.hierarchy(data);
  const links = root.links();
  const nodes = root.descendants();

  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  const margin = {
    top: 15,
    right: 15,
    bottom: 15,
    left: 15,
  };

  const drag = (simulation) => {
    function dragstarted(event, d) {
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
      simulation.alphaTarget(0.3).restart();
    }

    function dragended(event, d) {
      simulation.alphaTarget(1).stop();
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  const icon = (d) => {
    if (d.data.category !== undefined) {
      switch (d.data.category) {
        case "phone": {
          return "\uf095";
        }
        case "point": {
          return "\uf3c5";
        }
        default: {
          return;
        }
      }
    }
  };

  const getClass = (d) => {
    if (d.data.category) {
      return styles.color;
    }
  };

  const getRadius = (d) => {
    if (d.data.category) {
      return 15;
    }
    if (d.children === undefined) {
      return 3;
    }
    if (d.depth > 5) {
      return d.depth;
    }
    return 10 - 2 * d.depth;
  };

  const getFill = (d) => {
    if (d.children === undefined) {
      return "#b4b4b4";
    }
    return "#696969";
  };

  const getStroke = (d) => {
    if (d.children === undefined) {
      return "#b4b4b4";
    }
    return "#000";
  };

  const getDistance = (d) => {
    return d.target.children ? 200 : 50;
  };

  const getLabelSpace = (d) => {
    if (d.data.category) {
      return 20;
    }
    if (d.children === undefined) {
      return 10;
    }
    if (d.depth > 5) {
      return d.depth;
    }
    return 15 - 2 * d.depth;
  };

  const simulation = d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink(links))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const tooltip = d3
    .select(container)
    .append("div")
    .style("position", "absolute")
    .style("opacity", 0)
    .style("background-color", "transparent")
    .style("padding", "10px");

  const showTooltip = function (d) {
    tooltip.transition().duration(200);
    tooltip
      .style("opacity", 1)
      .html("Name: " + d.target.firstElementChild.innerHTML)
      .style("right", "50px")
      .style("top", "400px");
    // line(d, tooltip);
  };
  const moveTooltip = function (d) {
    tooltip.style("right", "50px").style("top", "400px");
    // line(d, tooltip);
  };
  const hideTooltip = function (d) {
    tooltip.transition().duration(200).style("opacity", 0);
  };

  const svg = d3
    .select(container)
    .append("svg")
    .attr("id", "graphContainer")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line");

  const node = svg
    .append("g")
    .attr("fill", "rgba(110,110,110,0.8)")
    .attr("stroke", "#000")
    .attr("stroke-width", 2)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("fill", (d) => getFill(d))
    .attr("stroke", (d) => getStroke(d))
    .attr("r", (d) => getRadius(d))
    .attr("id", (d) => "tooltip-" + d.data.name)
    .on("mouseenter", (d) => {
      showTooltip(d);
      // line(d);
    })
    .on("mousemove", (d) => {
      moveTooltip(d);
      // line(d);
    })
    .on("mouseleave", hideTooltip)
    .on("click", selectNode)
    .join("text")
    .text("something")
    .call(drag(simulation));

  const label = svg
    .append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "central")
    .attr("class", (d) => `fa ${getClass(d)}`)
    .style("cursor", "pointer")
    .text((d) => {
      return icon(d);
    })
    .call(drag(simulation));

  function selectNode(event, d) {
    if (event.defaultPrevented) {
      return;
    }

    d3.select(this).transition().attr("fill", "brown").attr("stroke", "brown");
  }

  // const textLabel = svg
  //   .append("g")
  //   .attr("class", "labels")
  //   .selectAll("text")
  //   .data(nodes)
  //   .enter()
  //   .append("text")
  //   .attr("text-anchor", "middle")
  //   .attr("dominant-baseline", "central")
  //   .style("color", "#c0c0c0")
  //   .style("cursor", "pointer")
  //   .text((d) => {
  //     return d.data.name;
  //   })
  //   .call(drag(simulation));

  node.append("text").text((d) => {
    return d.data.name;
  });

  // const line = (d) => {
  //   const boundary = d.target.getBoundingClientRect();
  //   d3.select(container)
  //     .append("div")
  //     .attr("class", "line")
  //     .style("position", "absolute")
  //     .style("width", "100%")
  //     .style("height", "100%")
  //     .style("top", 0)
  //     .append("svg")
  //     .attr("width", 300)
  //     .attr("height", 200)
  //     .append("path")
  //     .attr("fill", "none")
  //     .attr("stroke-dasharray", 1.5)
  //     .attr("stroke-width", 1)
  //     .attr("stroke", "#999")
  //     .attr(
  //       "d",
  //       `M ${boundary.x + boundary.width} ${
  //         boundary.y + boundary.height / 2
  //       } C ${boundary.x + 150} ${boundary.y} ${boundary.x + 150} ${
  //         boundary.y + 200
  //       } ${boundary.x + 300} ${boundary.y}`
  //     );
  // };

  // d3.select(container).call(
  //   d3
  //     .brush() // Add the brush feature using the d3.brush function
  //     .extent([
  //       [0, 0],
  //       [width, height],
  //     ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
  // );
  // declare brush
  const brush = d3
    .brush()
    .on("start", brushStart)
    .on("brush", brushed)
    .on("end", brushEnd)
    .extent([
      [-margin.left, -margin.top],
      [width + margin.right, height + margin.bottom],
    ]);
  function brushStart() {
    // if no selection already exists, colour all nodes by default
    if (d3.brushSelection(this)[0][0] == d3.brushSelection(this)[1][0]) {
      defaultColors();
    }
  }
  document.addEventListener("click", () => {
    defaultColors();
  });
  function brushEnd() {
    console.log("End");
    // if no selection already exists, colour all nodes by default
    defaultColors();
  }

  node.on("click");

  function defaultColors() {
    node.attr("fill", (d) => getFill(d)).attr("stroke", (d) => getStroke(d));
    link.attr("stroke", "#999");
  }

  // style brushed circles
  function brushed() {
    // use d3.brushSelection to get bounds of the brush
    const ext = d3.brushSelection(this);
    node.style("fill", (d) => {
      // if parts of any circles fall within the bounds of the brush, make them colourful!
      if (
        d.x >= ext[0][0] - getRadius(d) &&
        d.x <= ext[1][0] + getRadius(d) &&
        d.y >= ext[0][1] - getRadius(d) &&
        d.y <= ext[1][1] + getRadius(d)
      ) {
        return "red";
      }
    });
    node.style("stroke", (d) => {
      if (
        d.x >= ext[0][0] - getRadius(d) &&
        d.x <= ext[1][0] + getRadius(d) &&
        d.y >= ext[0][1] - getRadius(d) &&
        d.y <= ext[1][1] + getRadius(d)
      ) {
        return "red";
      }
    });
    link.style("stroke", (d) => {
      if (
        d.x >= ext[0][0] &&
        d.x <= ext[1][0] &&
        d.y >= ext[0][1] &&
        d.y <= ext[1][1]
      ) {
        return "red";
      }
    });
  }

  // create svg group element for brush
  const gBrush = svg.append("g").attr("class", "gBrush");

  // const saveSvgAsPng => (document.getElementsByTagName("svg")[0], "plot.png");

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    label
      .attr("x", (d) => {
        return d.x;
      })
      .attr("y", (d) => {
        return d.y;
      });
    //
    // textLabel
    //   .attr("x", (d) => {
    //     return d.x;
    //   })
    //   .attr("y", (d) => {
    //     return d.y + getLabelSpace(d);
    //   });
  });

  gBrush.call(brush);
  d3.select(dragButton).on("click", () => {
    console.log("dragButton");
  });

  d3.select(button).on("click", () => {
    const svgString = getSVGString(svg.node());

    svgString2Image(svgString, 2 * width, 2 * height, "png", save); // passes Blob and filesize String to the callback

    function save(dataBlob, filesize) {
      saveAs(dataBlob, "D3 vis exported to PNG.png"); // FileSaver.js function
    }
  });

  function getSVGString(svgNode) {
    svgNode.setAttribute("xlink", "http://www.w3.org/1999/xlink");
    const cssStyleText = getCSSStyles(svgNode);
    appendCSS(cssStyleText, svgNode);

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgNode);
    svgString = svgString.replace(/(\w+)?:?xlink=/g, "xmlns:xlink="); // Fix root xlink without namespace
    svgString = svgString.replace(/NS\d+:href/g, "xlink:href"); // Safari NS namespace fix

    return svgString;

    function getCSSStyles(parentElement) {
      const selectorTextArr = [];

      // Add Parent element Id and Classes to the list
      selectorTextArr.push("#" + parentElement.id);
      for (let c = 0; c < parentElement.classList.length; c++)
        if (!contains("." + parentElement.classList[c], selectorTextArr))
          selectorTextArr.push("." + parentElement.classList[c]);

      // Add Children element Ids and Classes to the list
      const nodes = parentElement.getElementsByTagName("*");
      for (let i = 0; i < nodes.length; i++) {
        const id = nodes[i].id;
        if (!contains("#" + id, selectorTextArr))
          selectorTextArr.push("#" + id);

        const classes = nodes[i].classList;
        for (let c = 0; c < classes.length; c++)
          if (!contains("." + classes[c], selectorTextArr))
            selectorTextArr.push("." + classes[c]);
      }

      // Extract CSS Rules
      let extractedCSSText = "";
      for (let i = 0; i < document.styleSheets.length; i++) {
        const s = document.styleSheets[i];

        try {
          if (!s.cssRules) continue;
        } catch (e) {
          if (e.name !== "SecurityError") throw e; // for Firefox
          continue;
        }

        const cssRules = s.cssRules;
        for (let r = 0; r < cssRules.length; r++) {
          if (contains(cssRules[r].selectorText, selectorTextArr))
            extractedCSSText += cssRules[r].cssText;
        }
      }

      return extractedCSSText;

      function contains(str, arr) {
        return arr.indexOf(str) === -1 ? false : true;
      }
    }

    function appendCSS(cssText, element) {
      const styleElement = document.createElement("style");
      styleElement.setAttribute("type", "text/css");
      styleElement.innerHTML = cssText;
      const refNode = element.hasChildNodes() ? element.children[0] : null;
      element.insertBefore(styleElement, refNode);
    }
  }
  function svgString2Image(svgString, width, height, format, callback) {
    var format = format ? format : "png";

    const imgsrc =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgString))); // Convert SVG string to data URL

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = width;
    canvas.height = height;

    const image = new Image();
    image.onload = function () {
      context.clearRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);

      canvas.toBlob(function (blob) {
        const filesize = Math.round(blob.length / 1024) + " KB";
        if (callback) callback(blob, filesize);
      });
    };

    image.src = imgsrc;
  }

  return svg.node();
}
