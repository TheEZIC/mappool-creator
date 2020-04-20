var reg = {
    group: /\[(?<name>\D+)=(?<mods>\d+)\]/,
    link: /https?:\/\/osu\.ppy\.sh\/b\/(?<id>\d+)/,
    link2: /https?:\/\/osu\.ppy\.sh\/beatmapsets\/(?<beatmapsetid>\d+)#\D+(?<beatmapid>\d+)/
};

class Parser {
    constructor(content) {
        this.file = content.split("\n");
        this.mappool = [];

        for(let line of this.file) {
            this.readString(line);
        }
    }

    readString(line) {
        if(reg.group.test(line)) {
            let data = line.match(reg.group);
            this.mappool.push({
                name: data.groups.name,
                mods: Number(data.groups.mods),
                maps: []
            });
        } else if (reg.link2.test(line)) {
            let data = line.match(reg.link2);
            this.mappool[this.mappool.length - 1].maps.push(Number(data.groups.beatmapid));
        }
        else if (reg.link.test(line)) {
            let data = line.match(reg.link);
            this.mappool[this.mappool.length - 1].maps.push(Number(data.groups.id));
        }
    }

    getPool = () => this.mappool;
}

module.exports = Parser;