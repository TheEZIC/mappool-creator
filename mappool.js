let xl = require('exceljs');
let osuMap = require('./map');
const { border } = require('./util');
let fs = require('fs');

class MapPool {
    constructor() {
        // Maps order by mods
        this.order = 0;
        // Next row
        this.row = 2;
        // Map №
        this.n = 0;
        // Create new excel document with 'Map pool' list
        this.book = new xl.Workbook();
        this.list = this.book.addWorksheet('Map pool', {properties:{defaultRowHeight: 35}}     /* {'sheetFormat': {'defaultRowHeight': 35}} */);
        /* this.bookStream = createAndFillWorkbook(); */
        this.list.state = 'visible';
        // Medium bordered cell style
        this.cellStyle = {
            alignment: {
                vertical: 'middle', 
                horizontal: 'center'
            }, 
            border: {
                top: {style: 'medium'}, 
                bottom: {style: 'medium'}, 
                left: {style: 'medium'}, 
                right: {style: 'medium'}
            }
        };

        this.init();
    }

    init() {
        //Create sheet header
        this.list.columns = [
            {header: '№', width: 6},
            {header: 'Background', width: 20},
            {header: 'Title', width: 90},
            {header: 'Link', width: 37},
            {header: 'LEN', width: 7},
            {header: 'BPM', width: 7},
            {header: 'SR', width: 7},
            {header: 'Stats', width: 30}
        ]

        //Style for sheet header
        for(let i = 1; i < 9; i++) {
            this.list.getRow(1).getCell(i).style = Object.assign({}, this.cellStyle, {font: {bold: true, size: 14}});
        }
    }
    
    //Add header and merge cells
    addHeader(name) {
        this.n = 0;
        this.list.getRow(this.row).getCell(1).value = name;
        this.list.getRow(this.row).getCell(1).style = Object.assign({}, this.cellStyle, {font: {bold: true, size: 24}});
        this.list.mergeCells(`A${this.row}:H${this.row}`);

        this.row++;
    }

    /**
     * Add map
     * @param {osuMap} map
     * @param {bf} bg src
     */
    addMap(map, bg) {
        let i = 0;

        //add Order and style
        this.list.getRow(this.row).getCell(++i).value = (++this.n);
        this.list.getRow(this.row).getCell(i).style = Object.assign({}, this.cellStyle, {font: {bold: true, size: 16}});
        //add BG and style
        this.setImage(`./${bg}`, this.row - 1, ++i);
        this.list.getRow(this.row).getCell(i).style = this.cellStyle;
        //add Title and style
        this.list.getRow(this.row).getCell(++i).value = `${map.artist} - ${map.title} [${map.diffName}]`;
        this.list.getRow(this.row).getCell(i).style = Object.assign({}, this.cellStyle, {font: {italic: true, bold: true, size: 14}});
        //add URL and style
        this.list.getRow(this.row).getCell(++i).value = `https://osu.ppy.sh/b/${map.id}`;
        this.list.getRow(this.row).getCell(i).style = this.cellStyle;
        //add Length and style
        this.list.getRow(this.row).getCell(++i).value = `${map.length}`;
        this.list.getRow(this.row).getCell(i).style = this.cellStyle;
        //add BPM and style
        this.list.getRow(this.row).getCell(++i).value = `${map.bpm}`;
        this.list.getRow(this.row).getCell(i).style = this.cellStyle;
        //add Star rate and style
        this.list.getRow(this.row).getCell(++i).value = `${map.stars.toFixed(2)}*`;
        this.list.getRow(this.row).getCell(i).style = this.cellStyle;
        //add Stats and style
        this.list.getRow(this.row).getCell(++i).value = map.stats.toString();
        this.list.getRow(this.row).getCell(i).style = this.cellStyle;

        this.row++;
    }

    // Add image to a cell
    setImage(path, row, col, style = {}) {
            let image = this.book.addImage({
                buffer: fs.readFileSync(path),
                extension: 'jpeg',
            });
            this.list.addImage(image, {
                tl: {
                    row,
                    col: col -1
                },
                br: {
                    row: row + 1,
                    col
                },
                editAs: 'oneCell'
            });
        
    }

    // Save map pool to the file
    savePool(file) {
        this.book.xlsx.writeFile(file);
    }
}

module.exports = MapPool;