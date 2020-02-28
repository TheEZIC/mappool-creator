/*
[Nomod=0]
https://osu.ppy.sh/b/143254
https://osu.ppy.sh/b/143254
[Hidden=8]
https://osu.ppy.sh/b/143254
https://osu.ppy.sh/b/143254
[Hardrock=16]
https://osu.ppy.sh/b/143254
https://osu.ppy.sh/b/143254
[DoubleTime=64]
https://osu.ppy.sh/b/143254
https://osu.ppy.sh/b/143254
[Freemod=0]
https://osu.ppy.sh/b/143254
https://osu.ppy.sh/b/143254
[Tiebreaker=0]
https://osu.ppy.sh/b/143254
https://osu.ppy.sh/b/143254
*/

var reg = {
    group: /\[(?<name>\D+)=(?<mods>\d+)\]/,
    link: /https?:\/\/osu\.ppy\.sh\/b\/(?<id>\d+)/
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
        } else if(reg.link.test(line)) {
            let data = line.match(reg.link);
            this.mappool[this.mappool.length - 1].maps.push(Number(data.groups.id));
        }
    }

    getPool = () => this.mappool;
}

module.exports = Parser;