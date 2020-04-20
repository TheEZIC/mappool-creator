var MapPool = require('./mappool'),
    Parser = require('./parser'),
    fs = require('fs'),
    api = require('./api'),
    API = new api(fs.readFileSync("./token.txt").toString()),
    { showHeader } = require('./util');

var mp = new MapPool();

var pool = new Parser(fs.readFileSync("./maps.txt").toString()).getPool();

(async function() {
    for(let group of pool) {
        if (showHeader) {
            mp.addHeader(group.name);
        }
        for(let map of group.maps) {
            let m = await API.getMap(map, group.mods);
            await m.saveBG(`${m.id}.jpg`);
            mp.addMap(m, `${m.id}.jpg`, group.name);
        }
    }
    mp.savePool('mapPool.xlsx');
})();

