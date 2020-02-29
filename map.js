var axios = require('axios').default,
    fs = require('fs');

class osuMap {
    constructor(data, mods) {
        this.mod = mods;

        this.speedMul = 1;
        this.multiplier = 1;

        this.getBaseModValues();

        this.mapsetId = Number(data.beatmapset_id);
        this.id = Number(data.beatmap_id);
        this.stats = {
            ar: Number(this.calculateAR(data.diff_approach)).toFixed(1), //data.diff_approach
            cs: Number(this.calculateCS(data.diff_size)).toFixed(1), //data.diff_size
            od: Number(this.calculateOD(data.diff_overall)).toFixed(1), //data.diff_overall
            hp: Number(this.calculateHP(data.diff_drain)).toFixed(1), //data.diff_drain
            toString() {
                return `AR:${this.ar} CS:${this.cs} OD:${this.od} HP:${this.hp}`;
            }
        };
        this.bpm = Number(data.bpm)
        this.stars = Number(data.difficultyrating);
        this.length = this.calculateLength(data.total_length);
        this.artist = data.artist;
        this.title = data.title;

        this.diffName = data.version;
    }

    calculateLength(length) {
        let minutes = String(Math.floor(length / 60));
        let seconds = String(Math.floor(length % 60));

        if (seconds.length != 2) {
            seconds = seconds + '0';
        }

        return `${minutes}:${seconds}`;
    }

    getBaseModValues() {
        switch (this.mod) {
            case 0: //NM
                this.speedMul = 1;
                this.multiplier = 1;
                break;
            case 8: //HD
                this.speedMul = 1;
                this.multiplier = 1;
            break;
            case 16: //HR
                this.speedMul = 1;
                this.multiplier = 1.4;
                break;
            case 64: //DT
                this.speedMul = 1.5;
                this.multiplier = 1;
                break;
            default:
                console.log('bruh');
                break;
        }
    }

    calculateOD(OD) {
        let baseOD = OD;
        baseOD *= this.multiplier;
        let odms = 80 - Math.ceil(6 * baseOD);
        odms = Math.min(80, Math.max(20, odms));
        odms /= this.speedMul;
        return (Math.ceil(((80 - odms) / 6)*10)/10);

    }

    calculateAR(AR) {
        let baseAR = AR;
        baseAR *= this.multiplier;
        let arms = (
            baseAR < 5 ?
            1800 - 120 * baseAR
            : 1200 - 150 * (baseAR - 5)
        );
        arms = Math.min(1800, Math.max(450, arms));
        arms /= this.speedMul;
        return (Math.ceil((
            arms > 1200 ?
            (1800 - arms) / 120
            : 5 + (1200 - arms) / 150
        ) * 10) / 10);
    }

    calculateCS(CS) {
        let baseCS = CS;
        if(this.mod == 16)
            baseCS *= 1.3;
        return Math.ceil((Math.min(baseCS, 10) * 10) / 10);
    }

    calculateHP(HP) {
        return Math.ceil((Math.min(HP * this.multiplier, 10) *10) / 10);
    }

    saveBG(path = './bg.jpg') {
        return new Promise(async r => {
            try {
                let { data } = await axios.get(`https://assets.ppy.sh/beatmaps/${this.mapsetId}/covers/cover.jpg`, {
                    responseType: 'stream'
                });
                let ws = fs.createWriteStream(path);
                data.pipe(ws).on('close', () => {
                    ws.end();
                    r();
                });
            } catch(err) {
                let emptyBG = fs.readFileSync('./emptyBG.jpg');
                fs.writeFileSync(path, emptyBG);
                r();
            }
        });
    }
}

module.exports = osuMap;