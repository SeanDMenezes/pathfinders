import { BLOCK_ACTION_TYPES } from "./block-types";

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