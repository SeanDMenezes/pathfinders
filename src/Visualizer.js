import React, { useState } from "react";
import { BLOCK_TYPES, PATHFINDERS } from "./util/blocks";
import Grid from "./components/grid/grid";
import Options from "./components/options/options";

import "./Visualizer.scss";


const Visualizer = () => {
    const [blockType, setBlockType] = useState(BLOCK_TYPES.OBSTACLE);
    
    // blocks info
    const [start, setStart] = useState({ row: 0, col: 0 });
    const [end, setEnd] = useState({ row: 5, col: 5 });
    const [obstacles, setObstacles] = useState([]);

    // pathfinder info
    const [visited, setVisited] = useState([]);
    const [toVisit, setToVisit] = useState({ row: -1, col: -1 });
    const [truePath, setTruePath] = useState([]);

    // algorithm info
    const [pathfinder, setPathfinder] = useState(PATHFINDERS.BFS)

    const clearObstacles = () => {
        setObstacles([]);
    }

    const clearPath = () => {
        setVisited([]);
        setToVisit({ row: -1, col: -1 });
        setTruePath([]);
    }

    const clearAll = () => {
        setStart({ row: -1, col: -1 });
        setEnd({ row: -1, col: -1 });
        clearPath();
        clearObstacles();
    }

    return (
        <div className="container">
            <Options
                blockType={blockType}
                setBlockType={setBlockType}
                pathfinder={pathfinder}
                setPathfinder={setPathfinder}
                clearObstacles={clearObstacles}
                clearPath={clearPath}
                clearAll={clearAll}
            />
            <Grid
                blockType={blockType}
                pathfinder={pathfinder}
                start={start}
                setStart={setStart}
                end={end}
                setEnd={setEnd}
                obstacles={obstacles}
                setObstacles={setObstacles}
                visited={visited}
                setVisited={setVisited}
                toVisit={toVisit}
                setToVisit={setToVisit}
                truePath={truePath}
                setTruePath={setTruePath}
            />
        </div>
    )

}

export default Visualizer;