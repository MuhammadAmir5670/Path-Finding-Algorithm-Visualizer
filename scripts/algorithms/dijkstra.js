function dijkstra__visualize(source, destination, heap, speed, distances=new Map(), visited=new Set()) {
    if (! heap.isEmpty()) {
        let {node, distance, path} = heap.pop();

        if (visited.has(node)) {
            // node.addClass("backtrack-node");
            setTimeout(dijkstra__visualize.bind(this), 0, source, destination, heap, speed, distances, visited);
            return ;
        }

        node.animate("current-node", speed);
        visited.add(node);

        if (node === destination) {
            console.log(path);
            this.path = path;
            path = this.getPath(destination);
            this.drawPath(path);
            heap.clear();
            return;
        }

        neighbours = grid.toNodes(node.neighbours());
        neighbours.forEach(neighbour => {
            // if node is not a wall node and is also not visited
            if (! neighbour.isWall && ! visited.has(neighbour)) {
                // get a copy of path until previous node
                pathToNeighbour = new Map(path);
                // append current node to the copied path
                pathToNeighbour.set(neighbour, node);
                // get uniform cost of traversing the current node
                cost = neighbour.weight ? neighbour.weight : 1;
                // calculate the distance from source node to current node
                distanceToNeighbour = distance + cost;
                // get the distance of reaching current node from source node
                distanceBefore = distances.get(neighbour)? distances.get(neighbour): Infinity;
                // if the calculated distance is smaller then the distance beofore
                if (distanceToNeighbour < distanceBefore) {
                    // replace it with the previous one
                    distances.set(neighbour, distanceToNeighbour);
                }
                // push the node with current distance in the heap
                heap.push(neighbour, distances.get(neighbour), pathToNeighbour);
            }
        });
    
    setTimeout(dijkstra__visualize.bind(this), speed, source, destination, heap, speed, distances, visited);

    }

}

function dijkstra__retrace(source, destination, heap) {
    let visited, distances, neighbours;
    visited = new Set();
    distances = new Map();

    while (! heap.isEmpty()) {
        let {node, distance, path} = heap.pop();

        if (visited.has(node)) {
            continue;
        }

        visited.add(node);
        node.addClass("retraced-visited-node");

        if (node === destination) {
            this.path = path;
            path = this.getPath(node);
            this.retracePath(path);
            heap.clear();
            return;
        }

        neighbours = grid.toNodes(node.neighbours());
        for (let neighbour of neighbours) {
            if (! neighbour.isWall && ! visited.has(neighbour)) {
                // get a copy of path until previous node
                pathToNeighbour = new Map(path);
                // append current node to the copied path
                pathToNeighbour.set(neighbour, node);
                // get uniform cost of traversing the current node
                cost = neighbour.weight ? neighbour.weight : 1;
                // calculate the distance from source node to current node
                distanceToNeighbour = distance + cost;
                // get the distance of reaching current node from source node
                distanceBefore = distances.get(neighbour)? distances.get(neighbour): Infinity;
                // if the calculated distance is smaller then the distance beofore
                if (distanceToNeighbour < distanceBefore) {
                    // replace it with the previous one
                    distances.set(neighbour, distanceToNeighbour);
                }
                // push the node with current distance in the heap
                heap.push(neighbour, distances.get(neighbour), pathToNeighbour);
            }
        }

    }
}


var dijkstra = new PathFinderAlgorithm();

map = new Map();

dijkstra.visualize = function(source, destination, speed) {
    let heap = new Heap();
    this.path = new Map();
    heap.push(source, 0);
    dijkstra__visualize.call(this, source, destination, heap, Math.floor(speed/3));
}

dijkstra.retrace = function(source, destination, speed) {
    if (this.path.size) {
        let heap = new Heap();
        this.path = new Map();
        heap.push(source, 0);
        dijkstra__retrace.call(this, source, destination, heap, Math.floor(speed/3));
    }
}