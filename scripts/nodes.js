class Point{
    static coordinates = [new Point(-1, 0), new Point(1, 0), new Point(0, 1), new Point(0, -1)]
    constructor(x, y){
        this.x = x;
        this.y = y;
    }

    neighbours() {
        let p1, p2, points = [];
        for (let point of Point.coordinates) {
            p1 = this.x + point.x;
            p2 = this.y + point.y;
            points.push(new Point(p1, p2));
        }
        return points;
    }

    isValid(rows, cols) {
        if (this.x >= 0 && this.x < rows && this.y >= 0 && this.y < cols)
            return true;
        false;
    }
}

class Node extends Point{
    constructor(row, col, size, isStart = false, isEnd = false, isWall = false, weight = 0) {
        super(row, col);
        this.size = size;
        this.nodeElement = this.createNodeElement();
        this.isStart = isStart;
        this.isEnd = isEnd;
        this.weight = weight;
        this.isWall = isWall;
    }

    get isWall() {
        if (this.__isWall__ instanceof Boolean) 
            return this.__isWall__;
        return this.nodeElement.classList.contains("wall-node");
    }

    set isWall(value) {
        this.__isWall__ = this.isWall;
        if (value && !this.__isWall__ && !this.isStart && !this.isEnd && !this.isVisited()) {
            this.nodeElement.classList.add("wall-node");
        } else if (!value && this.__isWall__) {
            this.nodeElement.classList.remove("wall-node");
        }
        this.__isWall__ = value
    }

    get isStart(){
        if (this.__isStart__)
            return true
        this.__isStart__ = this.nodeElement.classList.contains("start-node");
        return this.__isStart__;
    }

    set isStart(value) {
        this.__isStart__ = this.isStart;
        value = Boolean(value);
        if (value && !this.__isStart__ && !this.isEnd) {
            this.addClass("start-node");
            this.__isStart__ = value;
        }

        if (!value && this.__isStart__) {
            this.removeClass("start-node");
            this.__isStart__ = value;
        }
    }

    get isEnd(){
        if (this.__isEnd__)
            return true
        this.__isEnd__ = this.nodeElement.classList.contains("end-node");
        return this.__isEnd__;
    }

    set isEnd(value) {
        this.__isEnd__ = this.isEnd;
        value = Boolean(value);
        if (value && !this.__isEnd__ && !this.isStart) {
            this.addClass("end-node");
            this.__isEnd__ = value;
        }

        if (!value && this.__isEnd__) {
            this.removeClass("end-node");
            this.__isEnd__ = value;
        }
    }
    
    addClass(className) {
        this.nodeElement.classList.add(className)
    }

    removeClass(className) {
        this.nodeElement.classList.remove(className)
    }

    reset() {
        this.nodeElement.className = "node";
        if (this.__isStart__)
            this.nodeElement.classList.add("start-node");
        
        if (this.__isEnd__)
            this.nodeElement.classList.add("end-node");

        if (this.__isWall__)
            this.nodeElement.classList.add("wall-node");
    }

    animate(className, timeout) {
        if (! this.isVisited()) {
            this.addClass(className);
            setTimeout(() => {
                this.removeClass(className)
                this.addClass("visited-node")
            }, timeout);
        }
    }

    createNodeElement() {
        let element = document.createElement("td");
        element.className = "node";
        element.id = `${this.x}-${this.y}`;
        element.dataset["row"] = this.x;
        element.dataset["col"] = this.y;
        element.style.width = `${this.size}px`;
        element.style.height = `${this.size}px`;
        return element;
    }

    isVisited() {
        return this.nodeElement.classList.contains("visited-node");
    }

    static isNode(element) {
        if (element.classList.contains("node"))
            return true;
        return false;
    }
}