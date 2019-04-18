module.exports = class DmShuffleMock {
    constructor(schema) {
        this.struct = schema;
        this.count = 0;
    }
    toArray() {
        this.count++;
        return this.struct.map(columnType => columnType.patternFunction(this.count));
    }

    get schema() {
        return this.struct.map(obj => obj.name)
    }

    toCSV() {
        return `"${this.toArray().join('","')}"`;
    }
}