class Grid {
    static grid;
    static Nodes = [];
    static MouseDown = false;
    static x__Node;

    constructor(nodeSize) {
        this.initGrid();
        this.nodeSize = nodeSize;
        // this.rows = height > width ? Math.floor(Grid.grid.offsetHeight / this.nodeSize) : Math.floor((height - document.getElementById("controller").offsetHeight) / this.nodeSize);
        this.rows = Math.floor(height / this.nodeSize);
        this.cols = Math.floor(Grid.grid.offsetWidth / this.nodeSize);
        this.startNode = null;
        this.endNode = null;
        this.generate();
    }

    set PrevNode(node) {
        if ((node instanceof Node)) {
            Grid.x__Node = node;
        } else {
            Grid.x__Node = null;
        }
    }

    get PrevNode() {
        return Grid.x__Node;
    }

    // --------------- Static Methods -----------------
    static getNode(element) {
        if (Node.isNode(element)) {
            let row = element.dataset["row"];
            let col = element.dataset["col"];
            let node = Grid.Nodes[row][col];
            return node;
        } else {
            return null;
        }
    }

    toNodes(neighbours) {
        let rows=this.rows, cols=this.cols
        neighbours = neighbours.filter(function (point) {
            return point.isValid(rows, cols)
        })
        return neighbours.map(point => Grid.Nodes[point.x][point.y])
    }

    // --------------- instance Methods -----------------
    getRandNodeLocation() {
        let row = Math.floor(Math.random() * this.rows);
        let col = Math.floor(Math.random() * this.cols);
        return [row, col];
    }

    getLocationFromCenterNode({addToRow=0, addToCol=0}) {
        let row = Math.floor(this.rows / 2) + addToRow;
        let col = Math.floor(this.cols / 2) + addToCol;
        return [row, col];
    }

    initGrid() {
        if (Grid.grid === undefined) {
            Grid.grid = document.createElement("tbody");
            Grid.grid.id = "grid";
            this.initEvents()
            // appending the gird to the DOM
            document.getElementById("grid-container").appendChild(Grid.grid);
        }
    }

    initEvents() {
        Grid.grid.addEventListener("mousedown", this.mouseDownHandler);
        Grid.grid.addEventListener("mouseup", this.mouseUpHandler);
        Grid.grid.addEventListener("mousemove", this.mouseMoveHandler);
        Grid.grid.addEventListener("contextmenu", 
        function (e) {
            e.preventDefault();
            return false;
        });
    }

    haltEvents() {
        Grid.grid.removeEventListener("mousedown", this.mouseDownHandler);
        Grid.grid.removeEventListener("mouseup", this.mouseUpHandler);
        Grid.grid.removeEventListener("mousemove", this.mouseMoveHandler);
    }

    generate() {
        let startNodeRow, startNodeCol, endNodeRow, endNodeCol, row, rowNodes, currentNode;
        let space = Math.floor(this.cols / 4);
        [startNodeRow, startNodeCol] = this.getLocationFromCenterNode({addToCol: -space});
        [endNodeRow, endNodeCol] = this.getLocationFromCenterNode({addToCol: space});

        let fragment = document.createDocumentFragment();

        for (let i=0; i<this.rows; i++) {
            row = document.createElement("tr");
            row.className = "grid-row";
            rowNodes = [];
            
            for (let j=0; j<this.cols; j++) {
                currentNode = new Node(i, j, this.nodeSize);

                if (startNodeRow === i && startNodeCol === j) {
                    currentNode.isStart = true;
                    this.startNode = currentNode;
                } 

                if (endNodeRow === i && endNodeCol === j) {
                    currentNode.isEnd = true;
                    this.endNode = currentNode;
                }

                rowNodes.push(currentNode);
                row.appendChild(currentNode.nodeElement);
            }
            fragment.appendChild(row);
            Grid.Nodes.push(rowNodes);
        }
        Grid.grid.appendChild(fragment);
    }

    resize(size) {
        this.nodeSize = size;
        this.rows = height > width ? Math.floor(Grid.grid.offsetHeight / this.nodeSize) : Math.floor((height - document.getElementById("controller").offsetHeight)/ this.nodeSize);
        this.cols = Math.floor(width / this.nodeSize);
        Grid.Nodes = [];
        Grid.grid.innerHTML = "";
        this.generate(true);
    }

    clear(keep=true) {
        for (let row of Grid.Nodes) {
            for (let node of row) {
                // Start and End Node
                node.reset();

                // Wall Node
                if (node.isWall) {
                    if (keep)
                        continue;
                    else
                        node.isWall = false;
                }

                // Weight Node
                if (node.weight) {
                    if (keep)
                        continue;
                    else
                        node.weight = 0;
                }
            }
        }
    }

    // --------------- Event Handler Callbacks -----------------

    mouseDownHandler = (e) => {
        e.preventDefault();
        if (e.target === Grid.grid || e.which !== 1 || e.target.classList.contains("grid-row")) {
            return;
        }
        let node = Grid.getNode(e.target)

        if (!node.isStart && !node.isEnd)
            node.isWall = !node.isWall

        this.PrevNode = node;
        Grid.MouseDown = true;
    }

    mouseUpHandler = (e) => {
        e.preventDefault();
        Grid.MouseDown = false;
        this.PrevNode = null;
    }

    mouseMoveHandler = (e) => {
        e.preventDefault()
        if (e.target === Grid.grid || e.which !== 1 || e.target.classList.contains("grid-row")) {
            return;
        }

        if (Grid.MouseDown) {
            let node = Grid.getNode(e.target);

            if (this.PrevNode === node || node.isEnd || node.isStart)
                return;

            if (this.PrevNode.isStart && !node.__isWall__) {
                this.PrevNode.isStart = false;
                node.isStart = true;
                this.startNode = node;
                this.PrevNode = node;

                if (controller.algorithm != null) {
                    this.clear();
                    controller.algorithm.retrace.call(controller, this.startNode, this.endNode);
                }

                return;
            }

            if (this.PrevNode.isEnd && !node.__isWall__) {
                this.PrevNode.isEnd = false;
                node.isEnd = true;
                this.endNode = node;
                this.PrevNode = node;

                if (controller.algorithm != null) {
                    this.clear();
                    controller.algorithm.retrace.call(controller, this.startNode, this.endNode);
                }

                return;
            }

            if (!this.PrevNode.isStart && !this.PrevNode.isEnd) {
                node.isWall = !node.isWall;
                this.PrevNode = node;
            }
        }

    }    

}
