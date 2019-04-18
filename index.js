var faker = require('faker');

var randomName = faker.name.findName(); // Rowan Nikolaus
var randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
var randomCard = faker.helpers.createCard(); 


class DmRepo {
    constructor(fakerString, schema) {
        this.touples = [];
        this.pattern = fakerString;
        this.schema = schema
    }

    append() {
        const dataLength = this.touples.length;
        const car = this.fakeTouple(dataLength);
        this.touples.push(car);
    }

    fakeTouple() {
        const i = this.touples.length
        return [i, ...faker.fake(this.pattern).split('//')];   
    }

    get data() {
        return this.touples;
    }

    mock() {
        return this.touples.map( v => {
            return new DmMock(v, this.schema);
        })
    }

    get mockData() {
        return this.mock(this.schema)
    }
}

class DmCarsRepo extends DmRepo {
    constructor(quantity) {
        super("{{company.companyName}}//{{hacker.noun}}//{{date.recent}}", ["make_id", "make_name", "model_name", "record_dt"]);
        for (let i = 0; i < quantity; i++) {
            this.append()
        }
    }
}

class DmMock {
    constructor(data, schema) {
        schema.forEach((columnName, i) => { 
            this[columnName] = data[i]
        })
    }
}

const dmCarsRepo = new DmCarsRepo(1000);
console.table(dmCarsRepo.mockData);