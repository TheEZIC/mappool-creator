var axios = require('axios').default;
var osuMap = require('./map');
var qs = require('querystring');

class osuAPI {
    constructor(token) {
        this.token = token;

        this.api = axios.create({
            validateStatus: () => true,
            baseURL: "https://osu.ppy.sh/api",
            timeout: 1e4 
        });
    }

    async getMap(id, mods = 0) {
        let { data } = await this.api.get(`/get_beatmaps?${qs.stringify({ k: this.token, 
            b: id, 
            mods: mods & 338 
        })}`);
        return new osuMap(data[0], mods);
    }
}

module.exports = osuAPI;