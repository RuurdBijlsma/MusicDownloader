const {remote} = require('electron');
const {dialog} = require('electron').remote;
const utils = remote.require('./utils.js');

document.addEventListener('DOMContentLoaded', init);

function init() {
    window.mdc.autoInit();
    let searchInput = document.getElementById('search');
    searchInput.addEventListener('change', e => search(e.target.value));
    currentResults = {};

    document.querySelector('.mdc-dialog__backdrop').addEventListener('click', () => closeDialog('download-dialog'));

    youtube = new Youtube(localStorage.outputFolder);
}

function browse() {
    let window = remote.getCurrentWindow();
    disableMouse();
    dialog.showOpenDialog(window, {properties: ['openFile', 'openDirectory', 'multiSelections']}, folder => {
        if (folder !== undefined) {
            localStorage.outputFolder = folder;
            document.getElementById('output-filled').value = folder;
        }
        enableMouse();
    });
}

function openDialog(id) {
    let dialog = document.getElementById(id);
    let inner = dialog.querySelector('.mdc-dialog__surface');
    dialog.style.opacity = 1;
    inner.style.transform = 'scale(1)';
    let c = dialog.getAttribute('class');
    dialog.setAttribute('class', c + ' mdc-dialog--open');
    dialog.style.visibility = 'visible';
    return dialog;
}

function closeDialog(id) {
    let dialog = document.getElementById(id);
    let inner = dialog.querySelector('.mdc-dialog__surface');
    dialog.style.opacity = 0;
    inner.style.transform = 'scale(0.5)';
    setTimeout(() => {
        dialog.style.visibility = 'hidden';
        dialog.setAttribute('class', 'mdc-dialog mdc-dialog--closed');
    }, 200);
}

async function search(query) {
    let results = await youtube.searchMusic(query);
    let resultView = document.getElementById('results');
    let html = `<div id='resultList'>`;
    for (let result of results) {
        html += `<div class="music-card">
            <div class="music-image" style="background-image:url(${result.thumbnails.high.url})"></div>
            <div class="music-info">
                <div class="music-title">${result.title}</div>
                <div class="music-channel">${result.channelTitle}</div>
                <div class="music-actions">
                    <button class="mdc-button" onclick="download('${result.id}')">
                        DOWNLOAD
                    </button>
                    <button class="mdc-button" onclick="listen('${result.id}')">
                        LISTEN
                    </button>
                </div>
            </div>
        </div>`;
    }
    console.log(results);
    currentResults = results;
    resultView.innerHTML = html + `</div>`;
}

function download(id) {
    console.log("DOWNLOAD", id);
    let dialog = openDialog('download-dialog');
    let video = currentResults.find(v => v.id === id);
    currentVideo = video;
    document.getElementById('output-filled').value = localStorage.outputFolder;
    document.getElementById('title-filled').value = video.title;
    document.getElementById('artist-filled').value = video.channelTitle;
    youtube.outputPath = localStorage.outputFolder;

    art = currentVideo.thumbnail;

    youtube.getMetaData(video.title).then(data => {
        console.log(data);
        document.getElementById('title-filled').value = data.title;
        document.getElementById('artist-filled').value = data.artist;
        art = data.thumbnail;
    });
    console.log(video);
}

function exportDownload() {
    let window = remote.getCurrentWindow();
    youtube.download(currentVideo.id, {
            title: document.getElementById('title-filled').value,
            artist: document.getElementById('artist-filled').value,
            albumArt: art
        },
        p => {
            console.log("PROGRESS", p);
            window.setProgressBar(p.progress.percentage / 100);
        }
    ).then(done => {
        console.log("DONE", done);
        window.setProgressBar(0);
    });
}

function listen(id) {
    console.log("LISTEN", id);
}
function disableMouse() {
    document.body.style.pointerEvents = "none";
}
function enableMouse() {
    document.body.style.pointerEvents = "all";
}