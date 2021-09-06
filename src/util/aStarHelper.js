export const leastF = (toVisit) => {
    return toVisit.reduce((res, obj) => {
        return (obj.f < res.f) ? obj : res;
    });
}

export const manhattanDistance = (node, goal) => {
    return Math.abs(goal.row - node.row) + Math.abs(goal.col - node.col);
}

export const lowerF = (v, nodes) => {
    for (let node of nodes) {
        if (v.row === node.row && v.col === node.col && node.f < v.f) {
            return true;
        }
    }
    return false;
}