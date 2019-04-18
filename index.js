const faker = require('faker');
const fs = require('fs');

const { makeColumnType, DmShuffleMock} = require('./mock')

const carsSchema = [
    makeColumnType("make_id", (i) => i),
    makeColumnType("make_name", () => faker.fake("{{company.companyName}}")),
    makeColumnType("model_name", () => faker.fake("{{random.word}}")),
    makeColumnType("record_dt", () => { 
        let d = new Date(faker.fake("{{date.recent}}"))
        let str = `${d.getDay()}/${d.getMonth()}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
        return str;
    })
];

const carsMock = new DmShuffleMock(carsSchema);

function writeFile(writeble, mock, quantity) {
    console.time('PROCESO');
    writeble.write(`"${mock.schema.join('","')}"`);
    writeble.cork();
    for (let i = 0; i < quantity; i++) {
        if(i%10000 == 0) {
            console.log('PROCESO ' + Math.round(i / quantity * 10000) / 100 + '%');
            writeble.uncork()
            writeble.cork()
        }
        writeble.write('\n');
        writeble.write(mock.toCSV());
    }
    writeble.close();
    console.timeEnd('PROCESO');
}

function writableFile(tableName, mock, quantity) {
    const execDate = new Date().valueOf();
    const writable = fs.createWriteStream(`${tableName}-${execDate}.csv`);
    writeFile(writable, mock, quantity)
}

writableFile('carsRepo', carsMock, 10)