import React from "react";
import "./App.css";
import { ForceGraph } from "./components/forceGraph";
import data from "./data/data.json";
import data2 from "./data/data2.json";
import { SVGLine } from "./components/SVGLine";
import { ForceGraph2 } from "./components/forceGraph2";
import data3 from "./data/search-RESPONSE-200.json";
import { PrescientGraph } from "./components/praescientGraph";

function App() {
  return (
    <div className="App">
      {/*<header className="App-header">*/}
      {/*    Force Graph Example*/}
      {/*</header>*/}
      {/*<SVGLine startX={0} startY={200} endX={300} endY={0} />*/}
      {/*<section className="Main">*/}
      {/*  <ForceGraph data={data} />*/}
      {/*</section>*/}
      {/*<section className="Main">*/}
      {/*  <ForceGraph2 data={data2} />*/}
      {/*</section>*/}
      <section className="Main">
        <PrescientGraph data={data3} />
      </section>
    </div>
  );
}

export default App;
