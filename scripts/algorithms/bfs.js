// current node animation in a level
function BFS(currentNode, destination, queue=[]) {

    // visualize the current node
    currentNode.addClass("current-node");
    setTimeout(function() {
            currentNode.removeClass("current-node");
            currentNode.addClass("checked-node");
        }, 50
    )

    if (currentNode !== destination) {

        if (currentNode.isWall) {
            return ;
        }

        if (currentNode === destination) {
            // Draw Path
            
        }
        
        // get neighbouring nodes of the current node 
        neighbours = grid.toNodes(currentNode.neighbours());
        
        for (let node of neighbours) {
            if (!node.isWall && !this.path.has(node)) {
                queue.push(node);
                this.path.set(node, currentNode);
            }
        }
        setTimeout(BFS, 50, queue.shift(), destination, queue, this.path, currentNode);
    } else {
        return ;
    }
}

// current level wave Animation verion
function BFS__visualize(source, destination, queue=[], speed) {
    let currentLevelNodes;
    // if queue is not empty
    if (queue.length) {
        currentLevelNodes = queue.splice(0, queue.length);

        for (let currentNode of currentLevelNodes) {
            if (currentNode == source) {
                this.path.set(currentNode, null)
            }

            if (currentNode.isWall) {
                continue;
            }

            // visualize the current node
            currentNode.animate("current-node", speed);
            
            if (currentNode === destination) {
                path = this.getPath(destination);
                this.drawPath(path, source);
                queue = [];
                break;
            }

            // get neighbouring nodes of the current node 
            neighbours = grid.toNodes(currentNode.neighbours());

            for (let node of neighbours) {
                if (!node.isWall && !this.path.has(node)) {
                    queue.push(node);
                    this.path.set(node, currentNode);
                }
            }
        }

        setTimeout(BFS__visualize.bind(this), speed, source, destination, queue, speed);
    }

}

function BFS__retrace(source, destination) {
    let currentLevelNodes;
    let queue = [grid.startNode];
    // if queue is not empty
    while (queue.length) {
        currentLevelNodes = queue.splice(0, queue.length);

        for (let currentNode of currentLevelNodes) {
            if (currentNode == source) {
                this.path.set(currentNode, null)
            }

            if (currentNode.isWall) {
                continue;
            }

            // visualize the retracing of the path
            currentNode.addClass("retraced-visited-node");
            
            if (currentNode === destination) {
                path = this.getPath(destination);
                this.retracePath(path, source);
                queue = [];
                return ;
            }

            // get neighbouring nodes of the current node 
            neighbours = grid.toNodes(currentNode.neighbours());

            for (let node of neighbours) {
                if (!node.isWall && !this.path.has(node)) {
                    queue.push(node);
                    this.path.set(node, currentNode);
                }
            }
        }
    }
}

var BFS = new PathFinderAlgorithm();

BFS.visualize = function (source, destination, speed) {
    let queue = [source];
    this.path = new Map();
    BFS__visualize.call(this, source, destination, queue, speed);
}

BFS.retrace = function(source, destination, speed) {
    if (this.path.size) {
        let queue = [source];
        this.path = new Map();
        BFS__retrace.call(this, source, destination, queue, speed);
    }
}