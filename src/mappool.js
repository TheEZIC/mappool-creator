let xl = require('exceljs');
let osuMap = require('./map');
const { googleSheet } = require('../util');
let fs = require('fs');

class MapPool {
    constructor() {
        // Maps order by mods
        this.order = 0;
        // Next row
        this.row = 2;
        // Map №
        this.n = 0;
        // Add mode counter for mode group
        this.modeCounter = 1;
        // Name of current mode group name 
        this.currentModeName  = "";
        // Create new excel document with 'Map pool' list
        this.book = new xl.Workbook();
        this.list = this.book.addWorksheet('Map pool', {properties:{defaultRowHeight: 35}});
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
            {header: 'Mode', width: 20},
            {header: 'Title', width: 90},
            {header: 'SR', width: 7},
            {header: 'BPM', width: 7},
            {header: 'LEN', width: 7},
            {header: 'Stats', width: 30},
            {header: 'Mapper', width: 20},
            {header: 'Id', width: 20},
            {header: 'mapsetId', width: 20},
        ]

        //Style for sheet header
        for(let i = 1; i < this.list.columns.length + 1; i++) {
            this.list.getRow(1).getCell(i).style = Object.assign({}, this.cellStyle, {font: {bold: true, size: 14}});
        }
    }
    
    //Add header and merge cells
    addHeader(name) {
        this.n = 0;
        this.list.getRow(this.row).getCell(1).value = name;
        this.list.getRow(this.row).getCell(1).style = Object.assign({}, this.cellStyle, {font: {bold: true, size: 24}});
        this.list.mergeCells(`A${this.row}:K${this.row}`);

        this.row++;
    }

    /**
     * Add map
     * @param {osuMap} map
     * @param {bf} bg src
     * @param {group} group src
     */
    addMap(map, bg, group) {
        let i = 0;

        //add Order and style
        this.list.getRow(this.row).getCell(++i).value = (++this.n);
        this.list.getRow(this.row).getCell(i).style = Object.assign({}, this.cellStyle, {font: {bold: true, size: 16}});
        //add BG and style
        googleSheet 
        ? this.list.getRow(this.row).getCell(++i).value = `=IMAGE(\"https://assets.ppy.sh/beatmaps/${map.mapsetId}/covers/cover.jpg\")`
        : this.setImage(`./${bg}`, this.row - 1, ++i); 
        this.list.getRow(this.row).getCell(i).style = this.cellStyle;
        //add mode count
        this.list.getRow(this.row).getCell(++i).value = this.addMode(group);
        this.list.getRow(this.row).getCell(i).style = this.cellStyle;
        //add Title and style
        this.list.getRow(this.row).getCell(++i).value = googleSheet 
        ? `=HYPERLINK(\"https://osu.ppy.sh/b/${map.id}\" ; \"${map.artist} - ${map.title} [${map.diffName}]\")`
        : `${map.artist} - ${map.title} [${map.diffName}]`;
        this.list.getRow(this.row).getCell(i).style = Object.assign({}, this.cellStyle, {font: {italic: true, bold: true, size: 14}});
        //add Star rate and style
        this.list.getRow(this.row).getCell(++i).value = `${map.stars.toFixed(2)}*`;
        this.list.getRow(this.row).getCell(i).style = this.cellStyle;
        //add BPM and style
        this.list.getRow(this.row).getCell(++i).value = `${map.bpm}`;
        this.list.getRow(this.row).getCell(i).style = this.cellStyle;
        //add Length and style
        this.list.getRow(this.row).getCell(++i).value = `${map.length}`;
        this.list.getRow(this.row).getCell(i).style = this.cellStyle;
        //add Stats and style
        this.list.getRow(this.row).getCell(++i).value = map.stats.toString();
        this.list.getRow(this.row).getCell(i).style = this.cellStyle;
        //add Mapper and style
        this.list.getRow(this.row).getCell(++i).value = map.creator;
        this.list.getRow(this.row).getCell(i).style = this.cellStyle;
        //add Beatmap ID and style
        this.list.getRow(this.row).getCell(++i).value = map.id;
        this.list.getRow(this.row).getCell(i).style = this.cellStyle;
        //add Beatmap ID and style
        this.list.getRow(this.row).getCell(++i).value = map.mapsetId;
        this.list.getRow(this.row).getCell(i).style = this.cellStyle;
        this.row++;
    }

    addMode(group) {
        if (group !== this.currentModeName) {
            this.modeCounter = 1;
        }
        this.currentModeName = group;

        let string;

        switch (group) {
            case "Nomod":
                string = `NM${this.modeCounter}`;
                this.modeCounter++;
                break;
            case "Hidden":
                string = `HD${this.modeCounter}`;
                this.modeCounter++;
            break;
            case "Hardrock":
                string = `HR${this.modeCounter}`;
                this.modeCounter++;
            break;
            case "DoubleTime":
                string = `DT${this.modeCounter}`;
                this.modeCounter++;
            break;
            case "Freemod":
                string = `FM${this.modeCounter}`;
                this.modeCounter++;
            break;
            case "Tiebreaker":
                string = `TB${this.modeCounter}`;
                this.modeCounter++;
            break;
            default:
                string = 'wrong wrong'
                break;
        }
        return string
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