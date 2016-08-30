const del = require('del');
const mkdirp = require('mkdirp');
const execcli = require('execcli');
const fs = require('fs');
const path = require('path');

process.setMaxListeners(0);

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath).filter((file) => {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

let paths = {
    "modules": "/node_modules",
    "bin": "./node_modules/.bin/",
    "fluent": "./node_modules/.bin/fluentcv",
    "dist": "./dist/",
    "clean": "./dist/*"
};

/**
 * FluentCV themes:
 * - awesome    - manual build, latex tools required
 * - basis      - unstyled
 * - compact    - text glitches
 * - modern     - redundant elements
 * - positive   - fully working theme
 */
let formats = [];

fluentcvThemes = getDirectories(`${__dirname}${paths.modules}/fresh-themes/themes`);
fluentcvThemes.map((folder) => {
    formats.push({
        "pkg": folder,
        "renderName": folder
    });
});

/**
 * Bootswatch themes:
 * - Cerulean
 * - Cosmo
 * - Cyborg
 * - Darkly
 * - Flatly
 * - Journal
 * - Lumen
 * - Paper
 * - Readable
 * - Sandstone
 * - Simplex
 * - Slate
 * - Spacelab
 * - Superhero
 * - United
 * - Yeti
 */
freshbootstrapThemes = [
    "Cerulean",
    "Cosmo",
    "Cyborg",
    "Darkly",
    "Flatly",
    "Journal",
    "Lumen",
    "Paper",
    "Readable",
    "Sandstone",
    "Simplex",
    "Slate",
    "Spacelab",
    "Superhero",
    "United",
    "Yeti"
];
freshbootstrapThemes.map((folder) => {
    formats.push({
        "pkg": "node_modules/fresh-theme-bootstrap",
        "renderName": `fresh-theme-bootstrap-${folder.toLowerCase()}`,
        "cli": {"css": `${folder.toLowerCase()}`}
    });
});

// clean
del(paths.clean);

for (let format of formats) {
    mkdirp(`${paths.dist}/${format.renderName}`);

    let args = [
        `build`,
        `data/fresca.json`,
        `to`,
        `dist/${format.renderName}/resume-${format.renderName}.all`,
        {
            "t": `${format.pkg}`
        }
    ];

    if (format.cli !== undefined) {
        args.push(format.cli);
    }

    execcli(`${paths.fluent}`, args).then(() => {});
}
