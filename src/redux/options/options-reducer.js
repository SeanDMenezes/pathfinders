import { OPTION_ACTION_TYPES } from "./options-types";
import { BLOCK_TYPES } from "../../util/blocks";
import { PATHFINDERS } from "../../util/blocks";

const INITIAL_STATE = {
    blockType: BLOCK_TYPES.START,
    pathfinder: PATHFINDERS.BFS
};

const optionsReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case (OPTION_ACTION_TYPES.SET_BLOCK_TYPE):
            return {
                ...state,
                blockType: action.payload
            }
        case (OPTION_ACTION_TYPES.SET_PATHFINDER):
            return {
                ...state,
                pathfinder: action.payload
            }
        default:
            return {
                ...state
            }
    }
}

export default optionsReducer;