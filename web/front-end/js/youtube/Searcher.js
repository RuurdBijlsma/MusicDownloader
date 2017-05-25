const youtubeSearch = require('youtube-search');

class Searcher {
    constructor(maxResults = 5) {
        this.maxResults = maxResults;
    }

    async getKey() {
        if (this.key === undefined)
            this.key = await utils.readFile(utils.fixPath('res/api.key'));

        return this.key;
    }

    async search(query, category) {
        const key = await this.getKey();

        return new Promise((resolve, error) => {
            const opts = {
                maxResults: this.maxResults,
                key: key,
                type: 'video'
            };
            if (category !== undefined)
                opts.videoCategoryId = category;

            youtubeSearch(query, opts, (err, results) => {
                if (err) error(err);

                resolve(results);
            });
        });
    }
}