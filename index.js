const faker = require('faker');
const fs = require('fs');
const { Readable } = require('stream');

const { makeColumnType, DmShuffleMock} = require('./mock')

class MockReadable extends Readable {
    constructor(mock, quantity, options){
        super(options);
        this.__mock = mock;
        this._quantity = quantity;
        this._index = 0;
    }
    _read() {
        if(this._index == 0) {
            this.push(this.__mock.schema.join(','));
        } else if(this._index < this._quantity) {
            this.push('\n'+this.__mock.toCSV());
            if(this._index%100000 == 0) {
                console.log('PROCESO ' + Math.round(this._index / this._quantity * 10000) / 100 + '%');
            }
        } else {
            this.push(null);
        }
        this._index++
    }
}
function writeFile(writeble, mock, quantity) {
    const mockReadable = new MockReadable(mock, quantity);
    console.time('PROCESO');
    mockReadable.pipe(writeble);
    console.timeEnd('PROCESO');
}

function writableFile(tableName, mock, quantity) {
    const execDate = new Date().valueOf();
    const writable = fs.createWriteStream(`${tableName}-${execDate}.csv`);
    writeFile(writable, mock, quantity)
}

function recentDate () {
    let d = new Date(faker.fake("{{date.recent}}"))
    let str = `${d.getDay()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    return str;
}


const carsLength = 8000;
const msaLength = 7200;
const datesLength = 40000;
const dealersLength = 10000;
const salesAreaLength = 327605;
const factLength = 10000000;

const carsSchema = [
    makeColumnType("make_id", (i) => i),
    makeColumnType("make_name", () => '"' + faker.fake("{{company.companyName}}") + '"'),
    makeColumnType("model_name", () => '"' + faker.fake("{{random.word}}") + '"'),
    makeColumnType("record_dt", recentDate)
];

const msaSchema = [
    makeColumnType("msa_id", (i) => i),
    makeColumnType("msa_val", () => {
        const decimal = 5;
        const num = 5;
        return Math.round(Math.random()*10**(num+decimal))/10**decimal;
    }),
];
const transSchema = [
    makeColumnType("trans_id", (i) => i),
    makeColumnType("trans_date", recentDate),
];
const dealersSchema = [
    makeColumnType("sales_area_id", (i) => i),
    makeColumnType("dealer_name", () => faker.fake("{{name.firstName}} {{name.lastName}}")),
    makeColumnType("dealer_state", () => faker.fake("{{address.stateAbbr}}")),
    makeColumnType("dealer_city", () => faker.fake("{{address.city}}")),
    makeColumnType("dealer_zip", () => faker.fake("{{address.zipCode}}")),
    makeColumnType("dealer_sale_ind", () => {
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        return possible.charAt(Math.floor(Math.random() * possible.length));
    }),
];
const salesAreaSchema = [
    makeColumnType("sales_area_id", (i) => i),
    makeColumnType("sales_area_add", () => faker.fake("{{address.streetAddress}}")),
    makeColumnType("sales_city", () => faker.fake("{{address.city}}")),
    makeColumnType("sales_state", () => faker.fake("{{address.stateAbbr}}")),
];
const factSchema = [
    makeColumnType("vin", (i) => i),
    makeColumnType("make_id", () => Math.round(Math.random() * carsLength)),
    makeColumnType("dealer_id", () => Math.round(Math.random() * dealersLength)),
    makeColumnType("sales_area_id", () => Math.round(Math.random() * salesAreaLength)),
    makeColumnType("msa_id", () => Math.round(Math.random() * msaLength)),
    makeColumnType("trans_id", () => Math.round(Math.random() * datesLength)),
    makeColumnType("dlr_trans_type", () => {
        const possible = ["CREDIT", "CASH", "DEBIT"];
        return possible[Math.floor(Math.random() * possible.length)];
    }),
    makeColumnType("dlr_trans_amt", () => {
        const decimal = 2;
        const num = 5;
        return Math.round(400000 + Math.random()*10**(num+decimal))/10**decimal;
    }),
    makeColumnType("sales_commission", () => 1000 + Math.random() * 2500),
    makeColumnType("car_colour", () => faker.fake("{{commerce.color}}")),
    makeColumnType("car_year", () => Math.round(2010 + Math.random() * 9)),
    makeColumnType("adv_audio_pkg", () => {
        const possible = "YN";
        return possible.charAt(Math.floor(Math.random() * possible.length));
    }),
    makeColumnType("sunroof_pkg", () => {
        const possible = "YN";
        return possible.charAt(Math.floor(Math.random() * possible.length));
    }),
    makeColumnType("onstart_pkg", () => {
        const possible = "YN";
        return possible.charAt(Math.floor(Math.random() * possible.length));
    }),
    makeColumnType("record_timestamp", recentDate),
]
const carsMock = new DmShuffleMock(carsSchema);
const msaMock = new DmShuffleMock(msaSchema);
const transMock = new DmShuffleMock(transSchema);
const dealersMock = new DmShuffleMock(dealersSchema);
const salesAreaMock = new DmShuffleMock(salesAreaSchema);
const factMock = new DmShuffleMock(factSchema);

writableFile('dim_cars', carsMock, carsLength);
writableFile('dim_msa', msaMock, msaLength);
writableFile('dim_trans', transMock, datesLength);
writableFile('dim_dealers', dealersMock, dealersLength);
writableFile('dim_sales_area', salesAreaMock, salesAreaLength);
writableFile('fact_sales', factMock, factLength);