import React from "react";
import { RadioGroup, Radio, FormControlLabel, Button, Select } from "@material-ui/core";
import { BLOCK_TYPES, PATHFINDERS } from "../../util/blocks";

// css
import "./options.scss";

// redux
import { createStructuredSelector } from "reselect";
import { connect } from "react-redux";
import { selectOptions } from "../../redux/options/options-selector";
import { setBlockType, setPathfinder } from "../../redux/options/options-actions";
import { clearAll, clearObstacles, clearPath, randomizeObstacles } from "../../redux/block/block-actions";

const Options = ({ options, setBlockType, setPathfinder, clearObstacles, clearPath, clearAll, randomizeObstacles }) => {

    const handleBlockChange = (e) => {
        setBlockType(e.target.value);
    }

    const handlePathfinderChange = (e) => {
        setPathfinder(e.target.value);
    }

    return (
        <div className="optionsContainer">
            <RadioGroup
                aria-label="blockType"
                name="blocks"
                className="blocksContainer"
                value={options.blockType}
                onChange={(e) => handleBlockChange(e)}
            >
                <FormControlLabel value={BLOCK_TYPES.START} control={<Radio />} label="Start" className="blockLabel"/>
                <FormControlLabel value={BLOCK_TYPES.END} control={<Radio />} label="End" className="blockLabel"/>
                <FormControlLabel value={BLOCK_TYPES.OBSTACLE} control={<Radio />} label="Obstacle" className="blockLabel"/>
            </RadioGroup>

            <Button onClick={randomizeObstacles} className="randomButton">
                Randomize
            </Button>

            <div className="dropdownContainer">
                <Select
                    native
                    value={options.pathfinder}
                    onChange={(e) => handlePathfinderChange(e)}
                >
                    <option value={PATHFINDERS.BFS}> BFS (Breadth First Search) </option>
                    <option value={PATHFINDERS.DFS}> DFS (Depth First Search) </option>
                </Select>
            </div>

            <div className="buttonContainer">
                <Button onClick={clearObstacles} className="clearButton">
                    Clear Obstacles
                </Button>
                <Button onClick={clearPath} className="clearButton">
                    Clear Path
                </Button>
                <Button onClick={clearAll} className="clearButton">
                    Clear All
                </Button>
            </div>
        </div>
    )
}

// redux
const mapDispatch = dispatch => ({
    setBlockType: blockType => dispatch(setBlockType(blockType)),
    setPathfinder: pathfinder => dispatch(setPathfinder(pathfinder)),
    clearObstacles: () => dispatch(clearObstacles()),
    clearPath: () => dispatch(clearPath()),
    clearAll: () => dispatch(clearAll()),
    randomizeObstacles: () => dispatch(randomizeObstacles())
});

const mapState = createStructuredSelector({
    options: selectOptions,
});

export default connect(mapState, mapDispatch)(Options);
