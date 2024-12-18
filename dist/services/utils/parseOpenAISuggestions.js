"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parseOpenAISuggestions = (suggestionsText) => {
    const regex = /@@(.+?)@@\n([\s\S]*?)(?=\n@@|$)/g;
    const suggestionMatches = suggestionsText.matchAll(regex);
    const suggestions = [];
    for (const match of suggestionMatches) {
        const filename = match[1].trim();
        const suggestionText = match[2].trim();
        suggestions.push({ filename, suggestionText });
    }
    return suggestions;
};
exports.default = parseOpenAISuggestions;
