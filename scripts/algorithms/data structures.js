function Heap() {
    this.data = [];
}

Heap.prototype.isEmpty = function() {
    if (this.data.length === 0) 
        return true;
    return false;
}

Heap.prototype.clear = function() {
    this.data = [];
}

Heap.prototype.push = function(node, distance, path=new Map(), distances={}) {
    if (path.size === 0)
        path.set(node, null);
    this.data.push({node: node, distance: distance, path: path, distances: distances});
    this.data.sort((a, b) => b.distance - a.distance);
};

Heap.prototype.pop = function() {
    if (! this.isEmpty()) {
        var min = this.data.pop();
        return min
    } else {
        console.error("heap is empty");
        return null;
    }
};

Heap.prototype.extractMin = function() {
    if (! this.isEmpty()) {
        let size = this.data.length;
        let minimum = size - 1;
        let index = this.data.indexOf(this.data[minimum]);
        for (let current=minimum; current < size; current++){
            if (this.data[minimum].distance == this.data[current].distance) {
                if (this.data[current].distances.fromEnd < this.data[minimum].distances.fromEnd) {
                    minimum = current;
                }
            }
        }
        return this.data.splice(minimum, 1)[0];
    } else {
        console.error("heap is empty");
        return null;
    }

}