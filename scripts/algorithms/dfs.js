function DFS__visualize(source, destination, stack=[], previous=null, speed) {
    let currentNode, neighbours;

    // if stack is not empty
    if (stack.length) {
        
        // get the node from top of the stack
        currentNode = stack.pop();
        
        // if the node is visited backtrack
        if (this.path.has(currentNode)) {
            currentNode.addClass("backtrack-node");
            setTimeout(DFS, speed, source, destination, stack, currentNode, speed);
            return ;
        }

        this.path.set(currentNode, previous);
        // visualize the current node as visited node
        currentNode.animate("current-node", speed)
        
        if (currentNode === destination) {
            // Draw Path
            path = this.getPath(destination);
            this.drawPath(path, source);
            stack = []
            return ;
        }

        neighbours = grid.toNodes(currentNode.neighbours());

        for (let node of neighbours) {
            if (!node.isWall && !this.path.has(node)) {
                stack.push(node);
            }
        }
        setTimeout(DFS__visualize.bind(this), speed, source, destination, stack, currentNode, speed)

    }

}


function DFS__retrace(source, destination) {
    let stack = [source], prevNode=null, currentNode, neighbours;
    while(stack.length) {
        currentNode = stack.pop();
        
        if (this.path.has(currentNode))
            continue

        this.path.set(currentNode, prevNode);
        // visualize the current node as visited node
        currentNode.addClass("retraced-visited-node");
    
        if (currentNode === destination) {
            path = this.getPath(currentNode);
            this.retracePath(path, source);
            return;
        }

        neighbours = grid.toNodes(currentNode.neighbours());

        for (let node of neighbours) {
            if (! node.isWall && ! this.path.has(node)) {
                stack.push(node);
            }
        }
        prevNode = currentNode;
    }
}


var DFS = new PathFinderAlgorithm();

DFS.visualize = function(source, destination, speed) {
    grid.clear();
    let stack = [source];
    this.path = new Map();
    DFS__visualize.call(this, source, destination, stack, null, speed);
}

DFS.retrace = function(source, destination, speed) {
    if (this.path.size) {
        grid.clear();
        let stack = [source];
        this.path = new Map();
        DFS__retrace.call(this, source, destination, stack, null, speed);
    }
}