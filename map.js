var axios = require('axios').default,
    fs = require('fs');

class osuMap {
    constructor(data) {
        this.mapsetId = Number(data.beatmapset_id);
        this.id = Number(data.beatmap_id);
        this.stats = {
            ar: Number(data.diff_approach),
            cs: Number(data.diff_size),
            od: Number(data.diff_overall),
            hp: Number(data.diff_drain),
            toString() {
                return `AR:${this.ar} CS:${this.cs} OD:${this.od} HP:${this.hp}`;
            }
        };
        this.stars = Number(data.difficultyrating);
        this.length = Number(data.total_length);
        this.artist = data.artist;
        this.title = data.title;

        this.diffName = data.version;
    }

    async saveBG(path = './bg.jpg') {
        return new Promise(async r => {
            try {
                let { data } = await axios.get(`https://assets.ppy.sh/beatmaps/${this.mapsetId}/covers/cover.jpg`, {
                    responseType: 'stream'
                });
                let ws = fs.createWriteStream(path);
                data.pipe(ws).on('end', () => {
                    ws.end();
                    r();
                });
            } catch(err) {
                console.log(err);
                let emptyBG = fs.readFileSync('./emptyBG.jpg');
                fs.writeFileSync(path, emptyBG);
                r();
            }
        });
    }
}

module.exports = osuMap;