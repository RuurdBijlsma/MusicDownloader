const fs = require('fs');

exports.readFile = (name, encoding = 'utf8') => {
    return new Promise((resolve, error) => {
        fs.readFile(name, encoding, (err, data) => {
            if (err)
                error(err);
            else
                resolve(data);
        });
    });
};

exports.fileSize = name => fs.statSync(name).size;

exports.createFile = (name, content) => {
    return new Promise((resolve, error) => {
        fs.writeFile(name, content, err => {
            if (err)
                error();
            else
                resolve();
        });
    });
};

exports.deleteFile = file => fs.unlinkSync(file);

exports.createDirectory = name => {
    if (!fs.existsSync(name))
        fs.mkdirSync(name);
};

exports.deleteDirectory = name => {
    if (fs.existsSync(name)) {
        fs.readdirSync(name).forEach(file => {
            const curPath = name + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(name);
    }
};

exports.clearDirectory = name => {
    this.deleteDirectory(name);
    this.createDirectory(name);
};