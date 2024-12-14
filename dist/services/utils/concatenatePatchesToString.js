"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const concatenatePatchesToString = (files) => files.map(({ filename, patch }) => `${filename}\n${patch}\n`).join('');
exports.default = concatenatePatchesToString;
