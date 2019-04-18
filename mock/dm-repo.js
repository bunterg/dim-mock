module.exports = class DmRepo {
    constructor(columTypes) {
        this.tuples = [];
        this.struct = columTypes;
        this.count = 0;
    }

    append() {
        const id = this.tuples.length;
        const tuple = this.createTuple(id);
        this.tuples.push(tuple);
    }

    createTuple() {
        this.count++
        return new DmMock(this.struct, this.count)
    }

    get schema() {
        return this.struct.map(obj => obj.name)
    }

    get data() {
        return this.tuples;
    }

    get csv() {
        return this.tuples.map(t => t.toArray())
    }
}