import React from "react";
import styles from "./forceGraph2.module.css";
import { runForceGraph2 } from "./forceGraphGenerator2";

export function ForceGraph2({ data }) {
  const containerRef = React.useRef(null);

  React.useEffect(() => {
    runForceGraph2(containerRef.current, data);
  }, [data]);

  return <div ref={containerRef} className={styles.container} />;
}
