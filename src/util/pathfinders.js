import { setToVisit, setVisited } from "../redux/block/block-actions";
import { store } from "../redux/store";

const isVisited = (vertex, visited) => {
    for (let v of visited) {
        if (v.row === vertex.row && v.col === vertex.col) {
            return true;
        }
    }
    return false;
}

const isObstacle = (row, col, obstacles) => {
    for (let o of obstacles) {
        if (o.row === row && o.col === col) {
            return true;
        }
    }
    return false;
}

const isValid = (row, col, maxRows, maxCols, obstacles) => {
    if (0 <= row && row < maxRows && 0 <= col && col < maxCols) {
        return !isObstacle(row, col, obstacles);
    }
}

const getNeighbors = (u, maxRows, maxCols, obstacles) => {
    let neighbors = [];
    const { row, col } = u;
    const possibleNeighbors = [
        { row: row - 1, col: col     },
        { row: row,     col: col - 1 },
        { row: row,     col: col + 1 },
        { row: row + 1, col: col     },
    ]
    for (let neighbor of possibleNeighbors) {
        if (isValid(neighbor.row, neighbor.col, maxRows, maxCols, obstacles)) neighbors.push(neighbor);
    }
    return neighbors;
}

const traceParents = (start, end, parent, maxRows, maxCols) => {
    let path = [];
    let dest = maxCols * end.row + end.col
    let cur = dest;
    let curCoor = { row: Math.floor(cur / maxCols), col: cur - (Math.floor(cur / maxCols) * maxCols) };
    path.unshift(curCoor);
    while (!(curCoor.row === start.row && curCoor.col === start.col)) {
        cur = parent[cur];
        curCoor = { row: Math.floor(cur / maxCols), col: cur - (Math.floor(cur / maxCols) * maxCols) };
        path.unshift(curCoor);
    }
    // number all coordinates
    let retPath = path.map((coor, idx) => {
        return { row: coor.row, col: coor.col, value: idx }
    });
    return retPath;
}

export const bfs = async (maxRows, maxCols) => {
    const { blocks } = store.getState();
    const { start, end, obstacles } = blocks;

    // assuming visited and toVisit are both initially empty
    let visited = [start];
    let toVisit = [start];
    let parent = {};

    while (toVisit.length !== 0) {
        let u = toVisit.shift();
        if (u.row === end.row && u.col === end.col) {
            store.dispatch(setToVisit({ row: -1, col: -1 }));
            return traceParents(start, u, parent, maxRows, maxCols);
        }
        store.dispatch(setToVisit(u));
        let neighbors = getNeighbors(u, maxRows, maxCols, obstacles);
        for (let v of neighbors) {
            if (!isVisited(v, visited)) {
                toVisit.push(v);
                visited.push(v);
                parent[maxCols * v.row + v.col] = maxCols * u.row + u.col;
            }
            await new Promise(resolve => setTimeout(resolve, 1));
        }
        store.dispatch(setVisited(visited));
    }
    return [];
}

export const dfs = async (maxRows, maxCols) => {
    const { blocks } = store.getState();
    const { start, end, obstacles } = blocks;

    // assuming visited and toVisit are both initially empty
    let visited = [start];
    let toVisit = [start];
    let parent = {};

    while (toVisit.length !== 0) {
        let u = toVisit.shift();
        if (u.row === end.row && u.col === end.col) {
            store.dispatch(setToVisit({ row: -1, col: -1 }));
            return traceParents(start, u, parent, maxRows, maxCols);
        }
        store.dispatch(setToVisit(u));
        
        if (!isVisited(u, visited)) {
            visited.push(u);
        }
        let neighbors = getNeighbors(u, maxRows, maxCols, obstacles);
        for (let v of neighbors) {
            if (!isVisited(v, visited)) {
                toVisit.unshift(v);
                parent[maxCols * v.row + v.col] = maxCols * u.row + u.col;
            }
            await new Promise(resolve => setTimeout(resolve, 1));
        }
        store.dispatch(setVisited(visited));
    }
    return [];
}