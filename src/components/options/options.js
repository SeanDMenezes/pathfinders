import React from "react";
import { RadioGroup, Radio, FormControlLabel, Button, Select } from "@material-ui/core";
import { BLOCK_TYPES, PATHFINDERS } from "../../util/blocks";

// css
import "./options.scss";

const Options = ({ blockType, setBlockType, pathfinder, setPathfinder, clearObstacles, clearPath, clearAll }) => {

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
                value={blockType}
                onChange={(e) => handleBlockChange(e)}
            >
                <FormControlLabel value={BLOCK_TYPES.START} control={<Radio />} label="Start" className="blockLabel"/>
                <FormControlLabel value={BLOCK_TYPES.END} control={<Radio />} label="End" className="blockLabel"/>
                <FormControlLabel value={BLOCK_TYPES.OBSTACLE} control={<Radio />} label="Obstacle" className="blockLabel"/>
            </RadioGroup>

            <Button className="randomButton">
                Randomize
            </Button>

            <div className="dropdownContainer">
                <Select
                    native
                    value={pathfinder}
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

export default Options;