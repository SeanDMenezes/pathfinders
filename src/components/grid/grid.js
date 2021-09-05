import React, { useState } from "react";
import { Button } from "@material-ui/core";

import "./grid.scss";

// helpers
import { BLOCK_TYPES, PATHFINDERS } from "../../util/blocks";
import { bfs, dfs } from "../../util/pathfinders";

// redux
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { selectOptions } from "../../redux/options/options-selector";
import { addObstacle, clearPath, setEndBlock, setStartBlock, setToVisit, setTruePath, setVisited } from "../../redux/block/block-actions";
import { selectBlocks } from "../../redux/block/block-selector";

const Grid = ({ options, clearPath, blocks, setStart, setEnd, addObstacle, setTruePath }) => {
    // error display
    const [errors, setErrors] = useState({});

    // in process of finding path?
    const [searching, setSearching] = useState(false);

    const validatePoints = () => {
        const { start, end } = blocks;
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
        clearPath();
        let path;
        switch (options.pathfinder) {
            case PATHFINDERS.BFS:
                setSearching(true);
                path = await bfs();
                break;
            case PATHFINDERS.DFS:
                setSearching(true);
                path = await dfs();
                break;
            default:
                break;

        }
        setSearching(false);
        setTruePath(path);
        console.log(path);
    }

    // add block based on what block type is selected
    const setBlock = (rowIdx, colIdx) => {
        const { start, end } = blocks;
        const newBlock = { row: rowIdx, col: colIdx };
        switch (options.blockType) {
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
                addObstacle(newBlock);
                break;
            default:
                break;
        }
    }

    // determine which kind of block to display
    const displayBlock = (rowIdx, colIdx) => {
        const { start, end, obstacles, toVisit, visited, truePath } = blocks;
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

    const { numRows, numCols } = blocks;

    return (
        <div className="gridContainer">
            <Button className="gridButton" onClick={findPath}>
                Go!
            </Button>
            {numRows >= 0 && numCols >= 0 &&
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
            {searching && <span> Searching... </span>}
        </div>
    )
}

// redux
const mapState = createStructuredSelector({
    options: selectOptions,
    blocks: selectBlocks
});

const mapDispatch = dispatch => ({
    setStart: start => dispatch(setStartBlock(start)),
    setEnd: end => dispatch(setEndBlock(end)),
    addObstacle: obstacle => dispatch(addObstacle(obstacle)),
    setVisited: visited => dispatch(setVisited(visited)),
    setToVisit: toVisit => dispatch(setToVisit(toVisit)),
    setTruePath: truePath => dispatch(setTruePath(truePath)),
    clearPath: () => dispatch(clearPath())
});

export default connect(mapState, mapDispatch)(Grid);