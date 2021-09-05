import { OPTION_ACTION_TYPES } from "./options-types";

export const setBlockType = (blockType) => (
    {
        type: OPTION_ACTION_TYPES.SET_BLOCK_TYPE,
        payload: blockType
    }
);

export const setPathfinder = (pathfinder) => (
    {
        type: OPTION_ACTION_TYPES.SET_PATHFINDER,
        payload: pathfinder
    }
);