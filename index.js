var MapPool = require('./mappool'),
    Parser = require('./parser'),
    fs = require('fs'),
    api = require('./api'),
    API = new api(fs.readFileSync("./token.txt").toString());

var mp = new MapPool();

var pool = new Parser(fs.readFileSync("./maps.txt").toString()).getPool();

(async function() {
    for(let group of pool) {
        mp.addHeader(group.name);
        for(let map of group.maps) {
            let m = await API.getMap(map, group.mods);
            //console.log(m.id);
            await m.saveBG(`${m.id}.jpg`);
            mp.addMap(m, `${m.id}.jpg`);
        }
    }
    mp.savePool('mapPool.xlsx');
})();

