const YoutubeMusicChannelId = 'UC-9-kyTW8ZkZNDHQJ6FgpwQ';

class Youtube {
    constructor() {
        this.downloader = new Downloader();
        this.searcher = new Searcher(15);
        this.lastFM = new LastFM();
    }

    set outputPath(value) {
        this.downloader.initializeYD(value);
    }

    get outputPath() {
        return this.downloader.outputPath;
    }

    set maxResults(value) {
        this.searcher.maxResults = value;
    }

    get maxResults() {
        return this.searcher.maxResults;
    }

    async search(query) {
        return await this.searcher.search(query);
    }

    async searchMusic(query = '') {
        return await this.searcher.search(query, 10);
    }

    async download(id, metadata, onProgress = () => {
    }) {
        return await this.downloader.getMP3({
            id: id,
            name: metadata.title + '.mp3',
            metadata: metadata,
            onProgress: onProgress
        });
    }

    async getMetaData(title) {
        const response = await this.lastFM.getSongInfo(title);
        if (response.results.trackmatches.track.length <= 0)
            return null;
        const {artist, name, image} = response.results.trackmatches.track[0];
        const thumbnail = image[3]['#text'];
        return {
            artist: artist,
            title: name,
            thumbnail: thumbnail
        }
    }
}