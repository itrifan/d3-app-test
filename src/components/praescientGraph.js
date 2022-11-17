import React from "react";
import styles from "./forceGraph.module.css";
import { runPraescientGraph } from "./prescientGraphGenerator";

export function PrescientGraph({ data }) {
  const containerRef = React.useRef(null);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (containerRef.current) {
      setIndex(1);
      if (index === 0) {
        runPraescientGraph(containerRef.current, data);
      }
    }
  }, [data]);

  return <div ref={containerRef} className={styles.container} />;
}
