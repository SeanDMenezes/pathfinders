import { store } from "../store";
import { BLOCK_ACTION_TYPES } from "./block-types";

export const setNumRows = (numRows) => (
    {
        type: BLOCK_ACTION_TYPES.SET_NUM_ROWS,
        payload: numRows
    }
);

export const setNumCols = (numCols) => (
    {
        type: BLOCK_ACTION_TYPES.SET_NUM_COLS,
        payload: numCols
    }
);

export const setStartBlock = (startBlock) => (
    {
        type: BLOCK_ACTION_TYPES.SET_START,
        payload: startBlock
    }
);

export const setEndBlock = (endBlock) => (
    {
        type: BLOCK_ACTION_TYPES.SET_END,
        payload: endBlock
    }
);

export const addObstacle = (obstacle) => (
    {
        type: BLOCK_ACTION_TYPES.ADD_OBSTACLE,
        payload: obstacle
    }
);

export const setVisited = (visited) => (
    {
        type: BLOCK_ACTION_TYPES.SET_VISITED,
        payload: visited
    }
);

export const setToVisit = (toVisit) => (
    {
        type: BLOCK_ACTION_TYPES.SET_TO_VISIT,
        payload: toVisit
    }
);

export const setTruePath = (truePath) => (
    {
        type: BLOCK_ACTION_TYPES.SET_TRUE_PATH,
        payload: truePath
    }
);

export const clearObstacles = () => (
    {
        type: BLOCK_ACTION_TYPES.CLEAR_OBSTACLES
    }
);

export const clearPath = () => (
    {
        type: BLOCK_ACTION_TYPES.CLEAR_PATH
    }
);

export const clearAll = () => (
    {
        type: BLOCK_ACTION_TYPES.CLEAR_ALL
    }
);

export const randomizeObstacles = () => {
    const obstacleProbability = 0.35; // 35% chance for each block to be obstacle

    const { blocks } = store.getState();
    const { start, end, numRows, numCols } = blocks;

    let obstacles = [];
    for (let i = 0; i < numRows; ++i) {
        for (let j = 0; j < numCols; ++j) {
            const randBool = Math.random() < obstacleProbability;
            if (randBool) {
                const newObstacle = { row: i, col: j };
                if (newObstacle.row === start.row && newObstacle.col === start.col) continue;
                if (newObstacle.row === end.row && newObstacle.col === end.col) continue;
                obstacles.push(newObstacle);
            }
        }
    }

    return {
        type: BLOCK_ACTION_TYPES.RANDOMIZE_OBSTACLES,
        payload: obstacles
    }
}