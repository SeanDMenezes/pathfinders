import React, { useEffect, useState } from "react";
import { Button } from "@material-ui/core";

// styling
import "./grid.scss";
import { FaFlag, FaFlagCheckered } from 'react-icons/fa';

// helpers
import { BLOCK_TYPES, PATHFINDERS } from "../../util/blocks";
import { bfs, dfs, aStar, greedyBest } from "../../util/pathfinders";

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

    // mousedown
    const [mouseDown, setMouseDown] = useState(false);

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

    const findPath = async (staggered = true) => {
        if (!validatePoints()) return;
        clearPath();
        let path;

        setSearching(true);
        switch (options.pathfinder) {
            case PATHFINDERS.BFS:
                path = await bfs(staggered);
                break;
            case PATHFINDERS.DFS:
                path = await dfs(staggered);
                break;
            case PATHFINDERS.A_STAR:
                path = await aStar(staggered);
                break;
            case PATHFINDERS.GREEDY_BFS:
                path = await greedyBest(staggered);
                break;
            default:
                break;
        }
        setSearching(false);
        setTruePath(path);
        console.log(path);
    }

    const findInstantPath = async () => {
        await findPath(false);
    }

    const findStaggeredPath = async () => {
        await findPath(true);
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
                // make sure not to overwrite existing start/end block
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
            val = <FaFlag style={{ color: "lightgreen" }}/>
        }
        else if (rowIdx === end.row && colIdx === end.col) {
            val = <FaFlagCheckered />
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
            <div className={classes} key={colIdx} onMouseDown={() => setBlock(rowIdx, colIdx)} onMouseEnter={() => handleObstacleDrag(rowIdx, colIdx)}>
                {val}
            </div>
        );
    }

    // when user clicks and drags, and obstacle selected, populate obstacles
    const handleObstacleDrag = (rowIdx, colIdx) => {
        if (options.blockType !== BLOCK_TYPES.OBSTACLE) {
            return;
        }
        if (mouseDown) {
            const { start, end } = blocks;
            const newBlock = { row: rowIdx, col: colIdx };
            if (start.row === rowIdx && start.col === colIdx) return;
            if (end.row === rowIdx && end.col === colIdx) return;
            // addObstacle(newBlock); <-- uncomment to enable click and drag
        }
    }

    useEffect(() => {
        window.addEventListener("mousedown", () => setMouseDown(true));
        return () => {
            window.removeEventListener("mousedown", () => setMouseDown(false));
        }
    }, []);

    useEffect(() => {
        window.addEventListener("mouseup", () => setMouseDown(false));
        return () => {
            window.removeEventListener("mouseup", () => setMouseDown(false));
        }
    }, []);

    const { numRows, numCols } = blocks;

    return (
        <div className="gridContainer">
            <div className="buttonContainer">
                <Button className="gridButton" onClick={findInstantPath}>
                    Go! (Instant)
                </Button>
                <Button className="gridButton" onClick={findStaggeredPath}>
                    Go! (Staggered)
                </Button>
            </div>
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