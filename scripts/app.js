const height = window.innerHeight|| document.documentElement.clientHeight|| document.body.clientHeight;
const width = window.innerWdith || document.documentElement.clientWidth || document.body.clientWidth;
const nodeSize = 30;
const grid = new Grid(nodeSize);
const notifier = new Notification();

$('[data-toggle="tooltip"]').tooltip({html: true})

var algorithms = new Map();
algorithms.set("BFS", BFS);
algorithms.set("DFS", DFS);
algorithms.set("dijkstra", dijkstra);
algorithms.set("AStar", AStar);


class visualizer{
    constructor() {
        this.path = new Map();
        this.algorithm = null;
        this.speed = 150;
    }

    get nodeSize(){
        return document.getElementById("grid-size").value;
    }

    set nodeSize(value){
        grid.resize(value);
    }

    speedSelector = (target, speed) => {
        this.speed = speed;
        document.getElementById("speed-dropdown").innerHTML = `Speed: ${target.innerHTML}`;
    }

    algorithmsSelector = (choice) => {
        if (algorithms.has(choice)) {
            this.path.clear();
            grid.clear();
            this.algorithm = algorithms.get(choice);
            document.getElementById("visualize").innerHTML = "visualize " + choice;
        }
    }

    visualize = () => {
        if (this.algorithm == null || this.algorithm == undefined) {
            notifier.error({message: "Algorithm to visualize ain't selected. Please select the algorithm first."});
        } else {
            document.getElementById("grid").scrollIntoView();
            grid.clear();
            this.disableEvents();
            this.algorithm.visualize.call(this, grid.startNode, grid.endNode, this.speed);
        }
    }

    getPath = (node) => {
        let path = [];
        console.log(this.path);
        while (node != null && this.path.has(node)) {
            path.unshift(node);
            node = this.path.get(node);
        }
        return path;
    }

    drawPath(path) {
        if (path.length) {
            path.shift().addClass("path-node");
            setTimeout(this.drawPath.bind(this), 50, path);
        } else {
            this.enableEvents();
        }
    }

    retracePath(path) {
        console.log(path);
        for (let node of path) {
            node.addClass("retraced-path-node");
        }
    }

    initEvents() {
        document.getElementById("grid-size").addEventListener("input", () => { this.path.clear(); this.nodeSize = this.nodeSize; });
        document.getElementById("depth-first-search").addEventListener("click", (e) => { this.algorithmsSelector("DFS") });
        document.getElementById("breadth-first-search").addEventListener("click", (e) => { this.algorithmsSelector("BFS") });
        document.getElementById("dijkstra").addEventListener("click", (e) => { this.algorithmsSelector("dijkstra") });
        document.getElementById("a-star").addEventListener("click", (e) => { this.algorithmsSelector("AStar") });
        document.getElementById("clear-path").addEventListener("click", (e) => { this.path.clear(); grid.clear(true); });
        document.getElementById("clear-board").addEventListener("click", (e) => { this.path.clear(); grid.clear(false); });
        document.getElementById("visualize").addEventListener("click", this.visualize);
        document.getElementById("speed-slow").addEventListener("click", (e) => { this.speedSelector(e.target, 350) });
        document.getElementById("speed-normal").addEventListener("click", (e) => { this.speedSelector(e.target, 200) });
        document.getElementById("speed-fast").addEventListener("click", (e) => { this.speedSelector(e.target, 50) });
    }

    enableEvents() {
        grid.initEvents();
        document.getElementById("grid-size").disabled = false;
        document.getElementById("algorithmsDropdown").classList.remove("disabled");
        document.getElementById("mazes&patternDropdown").classList.remove("disabled");
        document.getElementById("speed-dropdown").classList.remove("disabled");
        document.getElementById("clear-path").classList.remove("disabled");
        document.getElementById("clear-board").classList.remove("disabled");
        document.getElementById("visualize").classList.remove("disabled");
    }

    disableEvents() {
        grid.haltEvents()
        document.getElementById("grid-size").disabled = true;
        document.getElementById("algorithmsDropdown").classList.add("disabled");
        document.getElementById("mazes&patternDropdown").classList.add("disabled");
        document.getElementById("speed-dropdown").classList.add("disabled");
        document.getElementById("clear-path").classList.add("disabled");
        document.getElementById("clear-board").classList.add("disabled");
        document.getElementById("visualize").classList.add("disabled");
    }

}

var controller = new visualizer();
controller.initEvents()