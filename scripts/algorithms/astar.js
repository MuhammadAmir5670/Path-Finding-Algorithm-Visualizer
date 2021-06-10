function astar__visualize(start, end, heap, speed, distances=new Map(), visited=new Set()){
    if (! heap.isEmpty()) {
        let {node, path} = heap.extractMin();
        distance = node === start? 0: distances.get(node);

        if (visited.has(node)) {
            setTimeout(astar__visualize.bind(this), 0, start, end, heap, speed, distances, visited);
            return;
        }

        node.animate("current-node", 50)
        visited.add(node);

        if (node === end) {
            this.path = path;
            path = this.getPath(node);
            this.drawPath(path);
            heap.clear()
            return ;
        }

        neighbours = grid.toNodes(node.neighbours());
        neighbours.forEach(neighbour => {
            if (! neighbour.isWall && ! visited.has(neighbour)) {
                // get a copy of path until previous node
                pathToNeighbour = new Map(path);
                // append current node to the copied path
                pathToNeighbour.set(neighbour, node);
                // get uniform cost of traversing the current node
                cost = neighbour.weight ? neighbour.weight : 1;
                // calculate the distance from source node to current node
                distanceFromStart = distance + cost;
                // get the distance of reaching current node from source node
                distanceBefore = distances.get(neighbour)? distances.get(neighbour): Infinity;
                // if the calculated distance is smaller then the distance beofore
                if (distanceFromStart < distanceBefore) {
                    // replace it with the previous one
                    distances.set(neighbour, distanceFromStart);
                } else {
                    return;
                }
                // push the node with current distance in the heap
                let heuristic = calculateHeuristic(neighbour, end)
                heap.push(
                    neighbour, 
                    heuristic + distances.get(neighbour), 
                    pathToNeighbour, 
                    {fromStart: distances.get(neighbour), fromEnd: heuristic}
                );
            }
        });
        setTimeout(astar__visualize.bind(this), speed, start, end, heap, speed, distances, visited);

    }
}

function astar__retrace (source, destination, heap) {
    let distances, visited, distance, neighbours;
    visited = new Set();
    distances = new Map();

    while (! heap.isEmpty()) {
        let {node, path} = heap.extractMin();
        distance = node === source? 0: distances.get(node);

        if (visited.has(node)) {
            continue;
        }

        visited.add(node);
        node.addClass("retraced-visited-node");

        if (node === destination) {
            this.path = path;
            path = this.getPath(destination);
            this.retracePath(path);
            heap.clear()
            return ;
        }

        neighbours = grid.toNodes(node.neighbours());
        neighbours.forEach(neighbour => {
            if (! neighbour.isWall && ! visited.has(neighbour)) {
                // get a copy of path until previous node
                pathToNeighbour = new Map(path);
                // append current node to the copied path
                pathToNeighbour.set(neighbour, node);
                // get uniform cost of traversing the current node
                cost = neighbour.weight ? neighbour.weight : 1;
                // calculate the distance from source node to current node
                distanceFromStart = distance + cost;
                // get the distance of reaching current node from source node
                distanceBefore = distances.get(neighbour)? distances.get(neighbour): Infinity;
                // if the calculated distance is smaller then the distance beofore
                if (distanceFromStart < distanceBefore) {
                    // replace it with the previous one
                    distances.set(neighbour, distanceFromStart);
                } else {
                    return;
                }
                // push the node with current distance in the heap
                let heuristic = calculateHeuristic(neighbour, destination)
                heap.push(
                    neighbour, 
                    heuristic + distances.get(neighbour), 
                    pathToNeighbour, 
                    {fromStart: distances.get(neighbour), fromEnd: heuristic}
                );
            }
        });
    }
}



function calculateHeuristic(current, end) {
    return Math.abs(current.x - end.x) + Math.abs(current.y - end.y);
}


var AStar = new PathFinderAlgorithm();

AStar.visualize = function (source, destination, speed) {
    console.log(speed);
    let heap = new Heap();
    heap.push(source, 0, new Map(), {fromStart: 0, fromEnd: 0});
    astar__visualize.call(this, source, destination, heap, speed);
}


AStar.retrace = function (source, destination, speed) {
    if (this.path.size) {
        let heap = new Heap();
        this.path = new Map();
        heap.push(source, 0, new Map(), {fromStart: 0, fromEnd: 0});
        astar__retrace.call(this, source, destination, heap, speed);
    }
}
