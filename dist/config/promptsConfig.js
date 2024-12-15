"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Prompt = void 0;
var Prompt;
(function (Prompt) {
    Prompt[Prompt["SYSTEM_PROMPT"] = 0] = "SYSTEM_PROMPT";
    Prompt[Prompt["IMPROVE_MENNT"] = 1] = "IMPROVE_MENNT";
})(Prompt || (Prompt = {}));
exports.Prompt = Prompt;
const promptsConfig = {
    [Prompt.SYSTEM_PROMPT]: 'You now assume the role of a code reviewer. Based on the patch provide a list of suggestions how to improve the code with examples according to coding standards and best practices.\nStart every suggestion with path to the file. Path to the file should start with @@ and end with @@',
    [Prompt.IMPROVE_MENNT]: 'I want you to act as a Senior developer. Below is a code patch, please help me do a brief code review on it. Any bug risks and/or improvement suggestions are welcome:'
};
exports.default = promptsConfig;
