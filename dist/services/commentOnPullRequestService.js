"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const gpt_3_encoder_1 = require("gpt-3-encoder");
const errorsConfig_1 = __importStar(require("../config/errorsConfig"));
const concatenatePatchesToString_1 = __importDefault(require("./utils/concatenatePatchesToString"));
const divideFilesByTokenRange_1 = __importDefault(require("./utils/divideFilesByTokenRange"));
const extractFirstChangedLineFromPatch_1 = __importDefault(require("./utils/extractFirstChangedLineFromPatch"));
const getOpenAiSuggestions_1 = __importDefault(require("./utils/getOpenAiSuggestions"));
const parseOpenAISuggestions_1 = __importDefault(require("./utils/parseOpenAISuggestions"));
const MAX_TOKENS = parseInt((0, core_1.getInput)('max_tokens'), 10) || 4096;
const OPENAI_TIMEOUT = 20000;
class CommentOnPullRequestService {
    constructor() {
        var _a, _b, _c;
        if (!process.env.GITHUB_TOKEN) {
            throw new Error(errorsConfig_1.default[errorsConfig_1.ErrorMessage.MISSING_GITHUB_TOKEN]);
        }
        if (!process.env.OPENAI_API_KEY) {
            throw new Error(errorsConfig_1.default[errorsConfig_1.ErrorMessage.MISSING_OPENAI_TOKEN]);
        }
        if (!github_1.context.payload.pull_request) {
            throw new Error(errorsConfig_1.default[errorsConfig_1.ErrorMessage.NO_PULLREQUEST_IN_CONTEXT]);
        }
        console.log("🚀 ~ CommentOnPullRequestService ~ constructor ~ context:", JSON.stringify(github_1.context));
        this.octokitApi = (0, github_1.getOctokit)(process.env.GITHUB_TOKEN);
        this.pullRequest = {
            owner: github_1.context.repo.owner,
            repo: github_1.context.repo.repo,
            pullHeadRef: (_a = github_1.context.payload) === null || _a === void 0 ? void 0 : _a.pull_request.head.ref,
            pullBaseRef: (_b = github_1.context.payload) === null || _b === void 0 ? void 0 : _b.pull_request.base.ref,
            pullNumber: (_c = github_1.context.payload) === null || _c === void 0 ? void 0 : _c.pull_request.number,
        };
    }
    getBranchDiff() {
        return __awaiter(this, void 0, void 0, function* () {
            const { owner, repo, pullBaseRef, pullHeadRef } = this.pullRequest;
            const { data: branchDiff } = yield this.octokitApi.rest.repos.compareCommits({
                owner,
                repo,
                base: pullBaseRef,
                head: pullHeadRef,
            });
            return branchDiff;
        });
    }
    getLastCommit() {
        return __awaiter(this, void 0, void 0, function* () {
            const { owner, repo, pullNumber } = this.pullRequest;
            const { data: commitsList } = yield this.octokitApi.rest.pulls.listCommits({
                owner,
                repo,
                per_page: 50,
                pull_number: pullNumber,
            });
            return commitsList[commitsList.length - 1].sha;
        });
    }
    createReviewComments(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const suggestionsListText = yield (0, getOpenAiSuggestions_1.default)((0, concatenatePatchesToString_1.default)(files));
            const suggestionsByFile = (0, parseOpenAISuggestions_1.default)(suggestionsListText);
            const { owner, repo, pullNumber } = this.pullRequest;
            const lastCommitId = yield this.getLastCommit();
            for (const file of files) {
                const firstChangedLine = (0, extractFirstChangedLineFromPatch_1.default)(file.patch);
                const suggestionForFile = suggestionsByFile.find((suggestion) => suggestion.filename === file.filename);
                if (suggestionForFile) {
                    try {
                        const consoleTimeLabel = `Comment was created successfully for file: ${file.filename}`;
                        console.time(consoleTimeLabel);
                        yield this.octokitApi.rest.pulls.createReviewComment({
                            owner,
                            repo,
                            pull_number: pullNumber,
                            line: firstChangedLine,
                            path: suggestionForFile.filename,
                            body: `[Auto Generated By ChatGPT]\n${suggestionForFile.suggestionText}`,
                            commit_id: lastCommitId,
                        });
                        console.timeEnd(consoleTimeLabel);
                    }
                    catch (error) {
                        console.error('An error occurred while trying to add a comment', error);
                        throw error;
                    }
                }
            }
        });
    }
    addCommentToPr() {
        return __awaiter(this, void 0, void 0, function* () {
            const { files } = yield this.getBranchDiff();
            if (!files) {
                throw new Error(errorsConfig_1.default[errorsConfig_1.ErrorMessage.NO_CHANGED_FILES_IN_PULL_REQUEST]);
            }
            const patchesList = [];
            const filesTooLongToBeChecked = [];
            for (const file of files) {
                if (file.patch && (0, gpt_3_encoder_1.encode)(file.patch).length <= MAX_TOKENS / 2) {
                    patchesList.push({
                        filename: file.filename,
                        patch: file.patch,
                        tokensUsed: (0, gpt_3_encoder_1.encode)(file.patch).length,
                    });
                }
                else {
                    filesTooLongToBeChecked.push(file.filename);
                }
            }
            if (filesTooLongToBeChecked.length > 0) {
                console.log(`The changes for ${filesTooLongToBeChecked.join(', ')} is too long to be checked.`);
            }
            const listOfFilesByTokenRange = (0, divideFilesByTokenRange_1.default)(MAX_TOKENS / 2, patchesList);
            yield this.createReviewComments(listOfFilesByTokenRange[0]);
            if (listOfFilesByTokenRange.length > 1) {
                let requestCount = 1;
                const intervalId = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    if (requestCount >= listOfFilesByTokenRange.length) {
                        clearInterval(intervalId);
                        return;
                    }
                    yield this.createReviewComments(listOfFilesByTokenRange[requestCount]);
                    requestCount += 1;
                }), OPENAI_TIMEOUT);
            }
        });
    }
}
exports.default = CommentOnPullRequestService;
