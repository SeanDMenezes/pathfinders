import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";

import "./grid.scss";
import { BLOCK_TYPES, PATHFINDERS } from "../../util/blocks";
import { bfs, dfs } from "../../util/pathfinders";

const BOX_SIZE = 20;

const Grid = ({ 
    blockType,
    pathfinder,
    start, setStart,
    end, setEnd,
    obstacles, setObstacles,
    visited, setVisited,
    toVisit, setToVisit,
    truePath, setTruePath
}) => {

    // grid display
    const [numRows, setNumRows] = useState(1);
    const [numCols, setNumCols] = useState(1);

    // error display
    const [errors, setErrors] = useState({});

    const validatePoints = () => {
        let newErrors = {};
        let isValid = true;
        if (start.row < 0 || start.col < 0) {
            newErrors.start = "Enter a valid starting point.";
            isValid = false;
        }
        if (end.row < 0 || end.col < 0) {
            newErrors.end = "Enter a valid endpoint.";
            isValid = false;
        }
        setErrors({ ...newErrors });
        return isValid;
    }

    const findPath = async () => {
        if (!validatePoints()) return;
        let path;
        switch (pathfinder) {
            case PATHFINDERS.BFS:
                path = await bfs(start, end, obstacles, numRows, numCols, setVisited, setToVisit);
                break;
            case PATHFINDERS.DFS:
                path = await dfs(start, end, obstacles, numRows, numCols, setVisited, setToVisit);
                break;
            default:
                break;

        }
        setTruePath(path);
        console.log(path);
    }

    // add block based on what block type is selected
    const setBlock = (rowIdx, colIdx) => {
        const newBlock = { row: rowIdx, col: colIdx };
        switch (blockType) {
            case BLOCK_TYPES.START:
                if (end.row === rowIdx && end.col === colIdx) break;
                setStart(newBlock);
                break;
            case BLOCK_TYPES.END:
                if (start.row === rowIdx && start.col === colIdx) break;
                setEnd(newBlock);
                break;
            case BLOCK_TYPES.OBSTACLE:
                // make sure not to overwrite exisitng start/end block
                if (start.row === rowIdx && start.col === colIdx) break;
                if (end.row === rowIdx && end.col === colIdx) break;
                setObstacles(obstacles.concat(newBlock));
                break;
            default:
                break;
        }
    }

    // determine which kind of block to display
    const displayBlock = (rowIdx, colIdx) => {
        let classes = "gridItem ";
        let val;
        if (rowIdx === start.row && colIdx === start.col) {
            classes += "gridStart";
        }
        else if (rowIdx === end.row && colIdx === end.col) {
            classes += "gridEnd";
        }
        else if (rowIdx === toVisit.row && colIdx === toVisit.col) {
            classes += "gridToVisit";
        }
        else {
            for (let obstacle of obstacles) {
                if (rowIdx === obstacle.row && colIdx === obstacle.col) {
                    classes += "gridObstacle";
                    break;
                }
            }
            for (let v of visited) {
                if (rowIdx === v.row && colIdx === v.col) {
                    classes += "gridVisited";
                    break;
                }
            }
            for (let v of truePath) {
                if (rowIdx === v.row && colIdx === v.col) {
                    classes = "gridItem gridPath";
                    val = v.value || "";
                    break;
                }
            }
        }

        return (
            <div className={classes} key={colIdx} onClick={() => setBlock(rowIdx, colIdx)}>
                {val}
            </div>
        );
    }

    // calculate number of rows and columns
    const getWindowDimensions = () => {
        const { innerWidth: width, innerHeight: height } = window;
        setNumRows(Math.max(
            Math.floor((height - 400) / BOX_SIZE),
            10
        ));
        setNumCols(Math.max(
            Math.floor((width - 580) / BOX_SIZE),
            0
        ));
    }

    useEffect(() => {
        getWindowDimensions();
    }, []);

    return (
        <div className="gridContainer">
            <Button className="gridButton" onClick={findPath}>
                Go!
            </Button>
            {numRows >=0 && numCols >= 0 &&
            [...Array(numRows)].map((rowVal, rowIdx) => (
                <div className="gridRow" key={rowIdx}>
                    {[...Array(numCols)].map((colVal, colIdx) => (
                        displayBlock(rowIdx, colIdx)
                    ))}
                </div>
            ))}

            {errors !== {} && (
                <span className="gridStatus">
                    {errors[Object.keys(errors)[0]]}
                </span>
            )}  
        </div>
    )
}

export default Grid;