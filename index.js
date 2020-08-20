const
    MapPool = require('./src/mappool'),
    Parser = require('./src/parser'),
    fs = require('fs'),
    api = require('./src/api'),
    API = new api(fs.readFileSync("./token.txt").toString()),
    { showHeader } = require('./util');

class Main {
    constructor() {
        this.checkDirs();
        let pools = this.readPools();
        this.writePools(pools);
    }

    checkDirs() {
        if (!fs.existsSync('./maps')) fs.mkdirSync('maps');
        if (!fs.existsSync('./covers')) fs.mkdirSync('covers');
        if (!fs.existsSync('./sheets')) fs.mkdirSync('sheets');
    }

    readPools() {
        let files = fs.readdirSync('./maps');

        return files.map(file => {
            if (!file.startsWith('maps') && !file.endsWith('.txt')) return null;

            let poolTextData = fs.readFileSync(`./maps/${file}`).toString();
            
            return {
                name: file.replace(/(maps|.txt)/gmi, '').trim(),
                data: new Parser(poolTextData).getPool()
            }
        })
    }

    writePools(pools) {
        pools.forEach(async pool => await this.createPool(pool));
    }

    async createPool(pool) {
        let { data, name } = pool;
        let mp = new MapPool();

        for(let group of data) {
            if (!group) return;
            if (showHeader) mp.addHeader(group.name);

            for(let map of group.maps) {
                let m = await API.getMap(map, group.mods);

                let coversDir = `./covers/${name || 'maps'}`
                let dirExistence = fs.existsSync(coversDir);
                if (!dirExistence) fs.mkdirSync(coversDir);

                await m.saveBG(`${coversDir}/${m.id}.jpg`);
                mp.addMap(m, `${coversDir}/${m.id}.jpg`, group.name);
            }
        }

        mp.savePool(`./sheets/${name || 'maps'}.xlsx`);
    }
}

new Main();

