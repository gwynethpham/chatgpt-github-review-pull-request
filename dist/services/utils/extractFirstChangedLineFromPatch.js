"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const extractFirstChangedLineFromPatch = (patch) => {
    const lineHeaderRegExp = /^@@ -\d+,\d+ \+(\d+),(\d+) @@/;
    const lines = patch.split('\n');
    const lineHeaderMatch = lines[0].match(lineHeaderRegExp);
    let firstChangedLine = 1;
    if (lineHeaderMatch) {
        firstChangedLine = lines.length - 1;
    }
    return firstChangedLine;
};
exports.default = extractFirstChangedLineFromPatch;
