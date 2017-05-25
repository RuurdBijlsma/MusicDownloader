const YoutubeMp3Downloader = require('./js/youtube/YoutubeMp3Downloader.js');
const isDev = require('electron-is-dev');

class Downloader {
    constructor(outputPath = utils.fixPath('res/output')) {
        this.initializeYD(outputPath);
    }

    initializeYD(outputPath) {
        this.YD = new YoutubeMp3Downloader({
            'ffmpegPath': utils.fixPath("res/ffmpeg.exe"),                     // Where is the FFmpeg binary located?
            'outputPath': outputPath,               // Where should the downloaded and encoded files be stored?
            'youtubeVideoQuality': 'highest',       // What video quality should be used?
            'queueParallelism': 2,                  // How many parallel downloads/encodes should be started?
            'progressTimeout': 500                 // How long should be the interval of the progress reports
        });

        this.callbacks = {};

        this.YD.on('finished', (error, data) => {
            if (this.callbacks[data.videoId])
                this.callbacks[data.videoId].resolve(data);
            else
                console.warn('Error: No callback for videoId!');
        });

        this.YD.on('progress', data => {
            if (this.callbacks[data.videoId])
                this.callbacks[data.videoId].onProgress(data);
            else
                console.warn('Error: No callback for videoId!');
        });

        this.YD.on('error', (error, data) => {
            console.warn("ERROR", {error: error, data: data});

            if (this.callbacks[data.videoId])
                this.callbacks[data.videoId].error(error);
            else
                console.warn('Error: No callback for videoId!');
        });
    }

    async getMP3({id, name, metadata, onProgress}) {
        return new Promise((resolve, error) => {
            this.callbacks[id] = {
                resolve: resolve,
                error: error,
                onProgress: onProgress
            };
            this.YD.download(id, name, metadata);
        });
    }
}