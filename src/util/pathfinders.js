import { setToVisit, setVisited } from "../redux/block/block-actions";
import { store } from "../redux/store";
import { leastF, lowerF, manhattanDistance } from "./aStarHelper";

// should the final answer come square by square, or all at once?
const staggered = true;

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

const isValid = (row, col) => {
    const { blocks } = store.getState();
    const { obstacles, numRows, numCols } = blocks;

    if (0 <= row && row < numRows && 0 <= col && col < numCols) {
        return !isObstacle(row, col, obstacles);
    }
}

const getNeighbors = (u) => {
    let neighbors = [];
    const { row, col } = u;
    const possibleNeighbors = [
        { row: row - 1, col: col     },
        { row: row,     col: col - 1 },
        { row: row,     col: col + 1 },
        { row: row + 1, col: col     },
    ]
    for (let neighbor of possibleNeighbors) {
        if (isValid(neighbor.row, neighbor.col)) neighbors.push(neighbor);
    }
    return neighbors;
}

const traceParents = (parent) => {
    const { blocks } = store.getState();
    const { start, end, numCols } = blocks;

    let path = [];
    let dest = numCols * end.row + end.col
    let cur = dest;
    let curCoor = { row: Math.floor(cur / numCols), col: cur - (Math.floor(cur / numCols) * numCols) };
    path.unshift(curCoor);
    while (!(curCoor.row === start.row && curCoor.col === start.col)) {
        cur = parent[cur];
        curCoor = { row: Math.floor(cur / numCols), col: cur - (Math.floor(cur / numCols) * numCols) };
        path.unshift(curCoor);
    }
    // number all coordinates
    let retPath = path.map((coor, idx) => {
        return { row: coor.row, col: coor.col, value: idx }
    });
    return retPath;
}

export const bfs = async () => {
    const { blocks } = store.getState();
    const { start, end, numCols } = blocks;

    // assuming visited and toVisit are both initially empty
    let visited = [start];
    let toVisit = [start];
    let parent = {};

    while (toVisit.length !== 0) {
        let u = toVisit.shift();
        if (u.row === end.row && u.col === end.col) {
            store.dispatch(setToVisit({ row: -1, col: -1 }));
            return traceParents(parent);
        }
        store.dispatch(setToVisit(u));
        let neighbors = getNeighbors(u);
        for (let v of neighbors) {
            if (!isVisited(v, visited)) {
                toVisit.push(v);
                visited.push(v);
                parent[numCols * v.row + v.col] = numCols * u.row + u.col;
            }
            if (staggered) await new Promise(resolve => setTimeout(resolve, 1));
        }
        store.dispatch(setVisited(visited));
    }
    return [];
}

export const dfs = async () => {
    const { blocks } = store.getState();
    const { start, end, numCols } = blocks;

    // assuming visited and toVisit are both initially empty
    let visited = [start];
    let toVisit = [start];
    let parent = {};

    while (toVisit.length !== 0) {
        let u = toVisit.shift();
        if (u.row === end.row && u.col === end.col) {
            store.dispatch(setToVisit({ row: -1, col: -1 }));
            return traceParents(parent);
        }
        store.dispatch(setToVisit(u));
        
        if (!isVisited(u, visited)) {
            visited.push(u);
        }
        let neighbors = getNeighbors(u);
        for (let v of neighbors) {
            if (!isVisited(v, visited)) {
                toVisit.unshift(v);
                parent[numCols * v.row + v.col] = numCols * u.row + u.col;
            }
            if (staggered) await new Promise(resolve => setTimeout(resolve, 1));
        }
        store.dispatch(setVisited(visited));
    }
    return [];
}

export const aStar = async () => {
    const { blocks } = store.getState();
    const { start, end, numCols } = blocks;

    // assuming visited and toVisit are both initially empty
    let visited = [{ row: start.row, col: start.col, f: 0, g: 0, h: 0 }];
    let toVisit = [{ row: start.row, col: start.col, f: 0, g: 0, h: 0 }];
    let parent = {};

    while (toVisit.length !== 0) {
        let q = leastF(toVisit);
        if (q.row === end.row && q.col === end.col) {
            store.dispatch(setToVisit({ row: -1, col: -1 }));
            return traceParents(parent);
        }
        
        toVisit = toVisit.filter(v => (!(v.row === q.row && v.col === q.col)));
        let neighbors = getNeighbors(q);
        store.dispatch(setToVisit(q));
        for (let v of neighbors) {
            v["g"] = q.g + 1;
            v["h"] = manhattanDistance(v, end);
            v["f"] = v.g + v.h;
            if (lowerF(v, toVisit) || lowerF(v, visited) || isVisited(v, visited)) {
                continue;
            }

            toVisit.push(v);
            parent[numCols * v.row + v.col] = numCols * q.row + q.col;
            if (staggered) await new Promise(resolve => setTimeout(resolve, 1));
        }

        visited.push(q);
        store.dispatch(setVisited(visited));
    }
    return [];
}

export const greedyBest = async () => {
    const { blocks } = store.getState();
    const { start, end, numCols } = blocks;

    // assuming visited and toVisit are both initially empty
    let visited = [{ row: start.row, col: start.col, f: 0 }];
    let toVisit = [{ row: start.row, col: start.col, f: 0 }];
    let parent = {};

    while (toVisit.length !== 0) {
        let q = leastF(toVisit);
        if (q.row === end.row && q.col === end.col) {
            store.dispatch(setToVisit({ row: -1, col: -1 }));
            return traceParents(parent);
        }
        
        toVisit = toVisit.filter(v => (!(v.row === q.row && v.col === q.col)));
        let neighbors = getNeighbors(q);
        store.dispatch(setToVisit(q));
        for (let v of neighbors) {
            v["f"] = manhattanDistance(v, end);
            if (lowerF(v, toVisit) || lowerF(v, visited) || isVisited(v, visited)) {
                continue;
            }

            toVisit.push(v);
            parent[numCols * v.row + v.col] = numCols * q.row + q.col;
            if (staggered) await new Promise(resolve => setTimeout(resolve, 1));
        }

        visited.push(q);
        store.dispatch(setVisited(visited));
    }
    return [];
}