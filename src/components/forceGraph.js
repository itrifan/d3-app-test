import React from "react";
import { runForceGraph } from "./forceGraphGenerator";
import styles from "./forceGraph.module.css";

export function ForceGraph({ data }) {
  const containerRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const dragRef = React.useRef(null);

  React.useEffect(() => {
    runForceGraph(
      containerRef.current,
      data,
      buttonRef.current,
      dragRef.current
    );
  }, [data]);

  return (
    <>
      <button ref={buttonRef}>Save</button>
      <button ref={dragRef}>Drag</button>
      <div ref={containerRef} className={styles.container} />
    </>
  );
}
