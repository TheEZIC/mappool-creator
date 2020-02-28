let xl = require('excel4node');
let osuMap = require('./map');
const { border } = require('./util');

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
        this.list = this.book.addWorksheet('Map pool', {
            'sheetFormat': {
                'defaultRowHeight': 35
            },
            'disableRowSpansOptimization': false
        });

        // Medium bordered cell
        this.cellStyle = {
            alignment: {
                horizontal: 'center',
                vertical: 'center',
                wrapText: true
            },
            border: {
                left: border,
                right: border,
                top: border,
                bottom: border
            }
        };

        this.init();
    }

    init() {
        this.list.column(1).setWidth(5); // №
        this.list.column(2).setWidth(20); // Background
        this.list.column(3).setWidth(70); // Title
        this.list.column(4).setWidth(37); // Link
        this.list.column(5).setWidth(7); // Length
        this.list.column(6).setWidth(7); // Star rating
        this.list.column(7).setWidth(20); // Stats (AR, CS, OD, HP)

        // Set properties in the first row
        this.setText('№', 1, 1, this.cellStyle);
        this.setText('Background', 1, 2, this.cellStyle);
        this.setText('Title', 1, 3, this.cellStyle);
        this.setText('Link', 1, 4, this.cellStyle);
        this.setText('Length', 1, 5, this.cellStyle);
        this.setText('Star rating', 1, 6, this.cellStyle);
        this.setText('Stats', 1, 7, this.cellStyle);
    }
    
    addHeader(name) {
        this.n = 0;
        this.setText(name, this.row, 1, this.cellStyle);
        this.row++;
    }

    /**
     * @param {osuMap} map
     */
    addMap(map, bg) {
        this.setNumber(++this.n, this.row, 1, this.cellStyle);
        this.setImage(bg, this.row, 2, this.cellStyle);
        this.setText(`${map.artist} - ${map.title} [${map.diffName}]`, this.row, 3, this.cellStyle);
        this.setHyperLink(`https://osu.ppy.sh/b/${map.id}`, this.row, 4, this.cellStyle);
        this.setText(`Length`, this.row, 5, this.cellStyle),
        this.setText(`${map.stars.toFixed(2)}*`, this.row, 6, this.cellStyle);
        this.setText(map.stats.toString(), this.row, 7, this.cellStyle);
        this.row++;
    }

    // Set cell's text
    setText(text, row, col, style = {}) {
        this.list.cell(row, col).string(text).style(style);
    }

    // Set cell's number
    setNumber(text, row, col, style = {}) {
        this.list.cell(row, col).number(text).style(style);
    }

    // Add hyperlink to a cell
    setHyperLink(link, row, col, style = {}) {
        this.list.cell(row, col).link(link).style(style);
    }

    // Add image to a cell
    setImage(path, row, col, style = {}) {
        this.list.addImage({
            path,
            type: 'picture',
            position: {
                type: 'twoCellAnchor',
                from: {
                    col,
                    colOff: 0,
                    row,
                    rowOff: 0
                },
                to: {
                    col: col + 1,
                    colOff: 0,
                    row: row + 1,
                    rowOff: 0
                }
            }
        });
        this.list.cell(row, col).style(style);
    }

    // Save map pool to the file
    savePool(file) {
        this.book.write(file);
    }
}

module.exports = MapPool;