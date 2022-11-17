import * as d3 from "d3";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from "./forceGraph.module.css";

export function runPraescientGraph(container, data) {
  let nodesData = [];
  let linksData = [];
  for (let i = 0; i < data.searches.length; i++) {
    // console.log(data.searches[i]?.search_results);
    if (data.searches[i].search_results.length) {
      for (let j = 0; j < data.searches[i].search_results.length; j++) {
        nodesData.push(data.searches[i].search_results[j]);
      }
    } else {
      for (
        let j = 0;
        j < data.searches[i].search_results.entities.length;
        j++
      ) {
        nodesData.push(data.searches[i].search_results.entities[j]);
      }
      for (let j = 0; j < data.searches[i].search_results.links.length; j++) {
        linksData.push({
          source: data.searches[i].search_results.links[j].fromEndId,
          target: data.searches[i].search_results.links[j].toEndId,
        });
      }
    }
  }

  const links = linksData.map((d) => Object.assign({}, d));
  const nodes = nodesData.map((d) => Object.assign({}, d));

  const containerRect = container.getBoundingClientRect();
  const height = containerRect.height;
  const width = containerRect.width;

  const getStrokeColor = (d) => {
    if (d.typeId) {
      switch (d.typeId) {
        case "ET1": {
          return "red";
        }
        case "ET4": {
          return "green";
        }
        case "ET5": {
          return "black";
        }
        case "ET8": {
          return "blue";
        }
        default: {
          return "black";
        }
      }
    }
    return "black";
  };

  const color = () => {
    return "rgba(110,110,110,0.8)";
  };

  const getIcon = (d) => {
    if (d.typeId) {
      switch (d.typeId) {
        case "ET1": {
          return "";
        }
        case "ET4": {
          return "";
        }
        case "ET5": {
          return "";
        }
        case "ET8": {
          return "\uf095";
        }
        default: {
          return "";
        }
      }
    }
  };

  const getClass = (d) => {
    return d.gender === "male" ? styles.male : styles.female;
  };

  const drag = (simulation) => {
    const dragstarted = (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    };

    const dragged = (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    };

    const dragended = (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    };

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  function selectNode(event, d) {
    if (event.defaultPrevented) {
      return;
    }

    d3.select(this).transition().attr("fill", "brown").attr("stroke", "brown");
  }

  document.addEventListener("click", () => {
    defaultColors();
  });

  function defaultColors() {
    node.attr("fill", (d) => color(d)).attr("stroke", (d) => getStrokeColor(d));
    link.attr("stroke", "#999");
  }

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(70)
    )
    .force("charge", d3.forceManyBody().strength(-200))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", [-width / 2, -height / 2, width, height]);

  const link = svg
    .append("g")
    .attr("stroke", "#999")
    .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", (d) => Math.sqrt(d.value));

  const node = svg
    .append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 12)
    .attr("fill", color)
    .attr("stroke", (d) => getStrokeColor(d))
    .attr("stroke-width", 2)
    .on("click", selectNode)
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
    .text((d) => {
      return getIcon(d);
    })
    .call(drag(simulation));

  simulation.on("tick", () => {
    //update link positions
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    // update node positions
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);

    // update label positions
    label
      .attr("x", (d) => {
        return d.x;
      })
      .attr("y", (d) => {
        return d.y;
      });
  });

  return svg.node();
}
