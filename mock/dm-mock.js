module.exports = class DmMock {
    constructor(schema, id) {
        schema.forEach((dataType) => {
            this[dataType.name] = dataType.patternFunction(id)
        })
    }
    
    toArray() {
        return Object.getOwnPropertyNames(this).reduce((a, e) => {
            if(typeof(a) == 'string') a=[this[a]]
            a.push(this[e])
            return a
        })
    }

    toCSV() {
        return `"${this.toArray().join('","')}"`;
    }
}