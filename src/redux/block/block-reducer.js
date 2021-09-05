import { BLOCK_ACTION_TYPES } from "./block-types";

const INITIAL_STATE = {
    numRows: 10,
    numCols: 10,
    start: { row: 0, col: 0 },
    end: { row: 2, col: 2 },
    obstacles: [],
    visited: [],
    toVisit: { row: -1, col: -1 },
    truePath: []
};

const blockReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case BLOCK_ACTION_TYPES.SET_NUM_ROWS:
            return {
                ...state,
                numRows: action.payload
            }
        case BLOCK_ACTION_TYPES.SET_NUM_COLS:
            return {
                ...state,
                numCols: action.payload
            }
        case BLOCK_ACTION_TYPES.SET_START:
            return {
                ...state,
                start: action.payload
            }
        
        case BLOCK_ACTION_TYPES.SET_END:
            return {
                ...state,
                end: action.payload
            }
        case BLOCK_ACTION_TYPES.ADD_OBSTACLE:
            return {
                ...state,
                obstacles: [...state.obstacles, action.payload]
            }
        case BLOCK_ACTION_TYPES.SET_VISITED:
            return {
                ...state,
                visited: action.payload
            }
        case BLOCK_ACTION_TYPES.SET_TO_VISIT:
            return {
                ...state,
                toVisit: action.payload
            }
        case BLOCK_ACTION_TYPES.SET_TRUE_PATH:
            return {
                ...state,
                truePath: action.payload
            }
        case BLOCK_ACTION_TYPES.CLEAR_OBSTACLES:
            return {
                ...state,
                obstacles: []
            }
        case BLOCK_ACTION_TYPES.CLEAR_PATH:
            const { visited, toVisit, truePath } = INITIAL_STATE;
            return {
                ...state,
                visited,
                toVisit,
                truePath
            }
        case BLOCK_ACTION_TYPES.CLEAR_ALL:
            const { numRows, numCols } = state;
            return {
                ...INITIAL_STATE,
                numRows,
                numCols
            }
        case BLOCK_ACTION_TYPES.RANDOMIZE_OBSTACLES:
            return {
                ...state,
                obstacles: action.payload
            }
        default:
            return {
                ...state
            };
    }
}

export default blockReducer;