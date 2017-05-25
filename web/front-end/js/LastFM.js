const net = remote.net;

class LastFM {
    constructor() {

    }

    async getKey() {
        if (this.key === undefined) {
            this.key = await utils.readFile(utils.fixPath('res/fm.key'));
        }

        return this.key;
    }

    async getSongInfo(songTitle) {
        songTitle = encodeURI(songTitle);

        const key = await this.getKey();
        const url = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${songTitle}&api_key=${key}&format=json`;
        const response = await fetch(url);

        return await response.json();
    }
}