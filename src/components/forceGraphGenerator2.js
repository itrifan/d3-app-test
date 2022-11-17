import * as d3 from "d3";
import "@fortawesome/fontawesome-free/css/all.min.css";
import styles from "./forceGraph2.module.css";

export function runForceGraph2(container, data) {
  const width = 1000;
  let height = 500;
  height = Math.min(500, width * 0.6);

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);
  const link = svg
    .selectAll(".link")
    .data(data.links)
    .join("line")
    .attr("class", styles.link);
  const node = svg
    .selectAll(".node")
    .data(data.nodes)
    .join("circle")
    .attr("r", 12)
    .attr("fill", "#ccc")
    .attr("stroke", "#000");
  // .attr("class", styles["node fixed"]);

  const simulation = d3
    .forceSimulation()
    .nodes(data.nodes)
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink(data.links));

  const drag = d3.drag().on("start", dragstart).on("drag", dragged);
  node.call(drag);

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => {
        console.log(d.source.x);
        return d.source.x;
      })
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
  });

  function click(event, d) {
    delete d.fx;
    delete d.fy;
    d3.select(this).attr("class", "");
    simulation.alpha(1).restart();
  }

  function dragstart() {
    d3.select(this).attr("class", "fixed");
  }

  function clamp(x, lo, hi) {
    return x < lo ? lo : x > hi ? hi : x;
  }

  function dragged(event, d) {
    console.log("dragged");
    d.fx = event.x;
    d.fy = event.y;
    simulation.alpha(1).restart();
  }

  return svg.node();
}
