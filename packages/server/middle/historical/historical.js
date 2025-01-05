const fs = require('fs')
const { parse } = require('csv-parse');


class Historical{
    
    constructor(){

    }
    toCamelCase(str) {
        return str
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
            .replace(/[^a-zA-Z0-9]/g, '');
    }
    async parseCSV(csvPath) {
        const records = [];
        const parser = fs.createReadStream(csvPath + '.csv', {encoding: 'utf8'})
            .pipe(parse({
                columns: header => header.map(column => this.toCamelCase(column)),
                skip_empty_lines: true,
                trim: true,
                bom: true,
                skip_empty_lines: true
            }));
    
        // Collect all rows
        for await (const row of parser) {
            records.push(row);
        }
        const output = records.map(({date, price, change}) => ({date, price, change}))
        fs.writeFileSync('output/' + csvPath + '.json', JSON.stringify(output))
        //console.log(output); // Note: Changed 'results' to 'records' to match the array name
        //return records;
    }
    
}
module.exports = Historical