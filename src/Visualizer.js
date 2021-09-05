import React from "react";
import Grid from "./components/grid/grid";
import Options from "./components/options/options";

import "./Visualizer.scss";


const Visualizer = () => {

    return (
        <div className="container">
            <Options />
            <Grid />
        </div>
    )
}

export default Visualizer;