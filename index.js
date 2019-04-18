const faker = require('faker');
const fs = require('fs');

function makeColumnType (columnName, patternFunction) {
    return {
        name: columnName,
        patternFunction: patternFunction
    }
}

class DmRepo {
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

class DmMock {
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

class DmShuffleMock {
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


const dmCarsRepo = new DmShuffleMock([
    makeColumnType("make_id", (i) => i),
    makeColumnType("make_name", () => faker.fake("{{company.companyName}}")),
    makeColumnType("model_name", () => faker.fake("{{random.word}}")),
    makeColumnType("record_dt", () => { 
        let d = new Date(faker.fake("{{date.recent}}"))
        let str = `${d.getDay()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
        return str;
    })
]);

const execDate = new Date().valueOf();
const writeble = fs.createWriteStream(`backUp-${execDate}.csv`);
writeble.write(`"${dmCarsRepo.schema.join('","')}"`);
for (let i = 0; i < 10000; i++) {
    writeble.write('\n');
    writeble.write(dmCarsRepo.toCSV());
}
writeble.close();